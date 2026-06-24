#!/usr/bin/env python3
"""
Calculate a cross-border ecommerce competition index from sampled marketplace data.

Input CSV fields should follow competition-index-sample-template.csv.
This script is a scoring scaffold: it computes the features that can be derived
from sample rows and leaves homogeneity/style judgments to the supplied columns.
"""

import csv
import statistics
import sys
from collections import Counter, defaultdict
from pathlib import Path


WEIGHTS = {
    "supply_density": 0.25,
    "review_concentration": 0.20,
    "ad_pressure": 0.15,
    "price_compression": 0.15,
    "homogeneity": 0.15,
    "brand_lockin": 0.10,
}

HEALTHY_PRICE_BANDS = {
    "press_on_nails": (12.99, 29.99),
    "kitchen_refresh": (24.99, 89.99),
    "washed_linen": (24.99, 89.99),
    "reading_nook": (14.99, 59.99),
    "scalp_tools": (9.99, 29.99),
    "fragrance_accessories": (9.99, 39.99),
}


def clamp(value: float, low: float = 0.0, high: float = 100.0) -> float:
    return max(low, min(high, value))


def as_float(value: str, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def as_int(value: str, default: int = 0) -> int:
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def result_count_score(result_count: float) -> float:
    if result_count < 1_000:
        return 20
    if result_count < 5_000:
        return 40
    if result_count < 20_000:
        return 60
    if result_count < 100_000:
        return 80
    return 100


def median_review_score(median_reviews: float) -> float:
    if median_reviews <= 50:
        return 20
    if median_reviews <= 200:
        return 40
    if median_reviews <= 800:
        return 60
    if median_reviews <= 2_000:
        return 80
    return 100


def above_fold_sponsored_score(count: int) -> float:
    if count == 0:
        return 10
    if count <= 2:
        return 30
    if count <= 4:
        return 60
    if count <= 6:
        return 80
    return 100


def confidence_grade(row_count: int, keyword_count: int, platform_count: int, has_ads: bool) -> str:
    if row_count >= 800 and keyword_count >= 8 and platform_count >= 3 and has_ads:
        return "A"
    if row_count >= 300 and keyword_count >= 5 and platform_count >= 2:
        return "B"
    if row_count >= 100 and keyword_count >= 3:
        return "C"
    return "D"


def percentile(values, pct):
    if not values:
        return 0.0
    ordered = sorted(values)
    index = (len(ordered) - 1) * pct
    lower = int(index)
    upper = min(lower + 1, len(ordered) - 1)
    fraction = index - lower
    return ordered[lower] * (1 - fraction) + ordered[upper] * fraction


def score_category(category, rows):
    n = len(rows)
    prices = [as_float(r.get("price_usd")) for r in rows if as_float(r.get("price_usd")) > 0]
    reviews = [as_int(r.get("review_count")) for r in rows]
    ranks = [as_int(r.get("rank")) for r in rows]
    result_counts = [as_float(r.get("result_count")) for r in rows if as_float(r.get("result_count")) > 0]

    top20 = [r for r in rows if 0 < as_int(r.get("rank")) <= 20]
    top50 = [r for r in rows if 0 < as_int(r.get("rank")) <= 50] or rows

    avg_result_score = statistics.mean([result_count_score(v) for v in result_counts]) if result_counts else 50
    valid_listing_score = clamp(len(top50) / max(n, 1) * 100)

    style_counts = Counter(r.get("image_style_group", "").strip().lower() for r in top50)
    most_common_style = style_counts.most_common(1)[0][1] if style_counts else 0
    duplicate_rate_score = clamp(most_common_style / max(len(top50), 1) * 100)

    supply_density = 0.50 * avg_result_score + 0.30 * valid_listing_score + 0.20 * duplicate_rate_score

    top20_reviews = [as_int(r.get("review_count")) for r in top20] or reviews
    median_reviews = statistics.median(top20_reviews) if top20_reviews else 0
    median_review_component = median_review_score(median_reviews)
    top10_reviews = sorted(reviews, reverse=True)[:10]
    top10_share = sum(top10_reviews) / max(sum(reviews), 1)
    top10_share_score = clamp(top10_share * 120)
    high_review_ratio = len([v for v in reviews if v > 1_000]) / max(len(reviews), 1)
    review_concentration = (
        0.40 * median_review_component
        + 0.35 * top10_share_score
        + 0.25 * high_review_ratio * 100
    )

    sponsored_top20 = [r for r in top20 if as_int(r.get("is_sponsored")) == 1]
    sponsored_ratio_score = clamp(len(sponsored_top20) / max(len(top20), 1) * 100)
    above_fold_count = len([r for r in rows if 0 < as_int(r.get("rank")) <= 8 and as_int(r.get("is_sponsored")) == 1])
    ad_pressure = 0.45 * sponsored_ratio_score + 0.35 * above_fold_sponsored_score(above_fold_count) + 0.20 * 50

    low_band, _ = HEALTHY_PRICE_BANDS.get(category, (12.99, 59.99))
    median_price = statistics.median(prices) if prices else 0
    low_price_ratio_score = len([p for p in prices if p < low_band]) / max(len(prices), 1) * 100
    estimated_landed_cost = median_price * 0.35 if median_price else 0
    margin_pressure = clamp(100 - (((median_price - estimated_landed_cost) / max(median_price, 1)) * 100))
    q1 = percentile(prices, 0.25)
    q3 = percentile(prices, 0.75)
    price_iqr = q3 - q1
    price_narrowness = clamp(100 - min(100, price_iqr / max(median_price, 1) * 200))
    price_compression = 0.45 * low_price_ratio_score + 0.35 * margin_pressure + 0.20 * price_narrowness

    title_tokens = [
        token.lower()
        for r in top50
        for token in r.get("title", "").replace("/", " ").replace("-", " ").split()
        if len(token) > 3
    ]
    common_token_ratio = 0
    if title_tokens:
        token_counts = Counter(title_tokens)
        common_token_ratio = sum(count for _, count in token_counts.most_common(10)) / len(title_tokens)
    visual_similarity = duplicate_rate_score
    title_similarity = clamp(common_token_ratio * 180)
    function_counts = Counter(r.get("core_function", "").strip().lower() for r in top50)
    material_counts = Counter(r.get("core_material", "").strip().lower() for r in top50)
    function_similarity = clamp((function_counts.most_common(1)[0][1] if function_counts else 0) / max(len(top50), 1) * 100)
    material_similarity = clamp((material_counts.most_common(1)[0][1] if material_counts else 0) / max(len(top50), 1) * 100)
    homogeneity = (
        0.40 * visual_similarity
        + 0.25 * title_similarity
        + 0.20 * function_similarity
        + 0.15 * material_similarity
    )

    big_brand_ratio = len([r for r in top20 if as_int(r.get("is_big_brand")) == 1]) / max(len(top20), 1)
    seller_counts = Counter(r.get("brand_or_shop", "").strip().lower() for r in top50)
    repeat_seller_ratio = len([seller for seller, count in seller_counts.items() if seller and count > 1]) / max(len(seller_counts), 1)
    brand_lockin = 0.40 * big_brand_ratio * 100 + 0.20 * repeat_seller_ratio * 100 + 0.40 * 40

    final_score = (
        supply_density * WEIGHTS["supply_density"]
        + review_concentration * WEIGHTS["review_concentration"]
        + ad_pressure * WEIGHTS["ad_pressure"]
        + price_compression * WEIGHTS["price_compression"]
        + homogeneity * WEIGHTS["homogeneity"]
        + brand_lockin * WEIGHTS["brand_lockin"]
    )

    keywords = {r.get("keyword", "") for r in rows if r.get("keyword")}
    platforms = {r.get("platform", "") for r in rows if r.get("platform")}
    has_ads = any(r.get("is_sponsored", "") != "" for r in rows)

    return {
        "category": category,
        "sample_rows": n,
        "keywords": len(keywords),
        "platforms": len(platforms),
        "supply_density": round(supply_density, 2),
        "review_concentration": round(review_concentration, 2),
        "ad_pressure": round(ad_pressure, 2),
        "price_compression": round(price_compression, 2),
        "homogeneity": round(homogeneity, 2),
        "brand_lockin": round(brand_lockin, 2),
        "competition_index": round(final_score, 2),
        "confidence": confidence_grade(n, len(keywords), len(platforms), has_ads),
    }


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: calculate_competition_index.py <sample.csv>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    grouped = defaultdict(list)
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            category = row.get("category", "").strip()
            if category:
                grouped[category].append(row)

    fieldnames = [
        "category",
        "sample_rows",
        "keywords",
        "platforms",
        "supply_density",
        "review_concentration",
        "ad_pressure",
        "price_compression",
        "homogeneity",
        "brand_lockin",
        "competition_index",
        "confidence",
    ]
    writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
    writer.writeheader()
    for category, rows in sorted(grouped.items()):
        writer.writerow(score_category(category, rows))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
