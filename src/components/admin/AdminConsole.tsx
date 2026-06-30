"use client";

import { ChangeEvent, FormEvent, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Archive, BarChart3, Bell, Boxes, ChevronDown, ChevronRight, ClipboardList, ImagePlus, Loader2, Megaphone, MessageSquareText, Plus, Reply, Save, UploadCloud, Users } from "lucide-react";
import { fallbackHomeContent, type HomeContent } from "@/lib/site-content";
import { heroSlides, productLines, products, reviews } from "@/lib/fallback-data";
import { storefrontLineOptionsByCategory, type ProductCategory } from "@/lib/product-line-config";

type ProductLineSlug = "lift-5f" | "lift-5" | "lift-x" | "boards" | "masts" | "wings";
type ProductSpecValue = string | { text?: string; image?: string };

const lineOptionsByCategory = storefrontLineOptionsByCategory as Record<ProductCategory, Array<{ label: string; value: ProductLineSlug }>>;

const storefrontLineOptions = (Object.entries(lineOptionsByCategory) as Array<[ProductCategory, Array<{ label: string; value: ProductLineSlug }>]>)
  .flatMap(([category, options]) => options.map((option) => ({ category, ...option })));

function getProductLineDisplayName(slug: ProductLineSlug) {
  return storefrontLineOptions.find((option) => option.value === slug)?.label ?? slug;
}

type HeroSlideRow = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
  sort_order: number;
  is_active: boolean;
};

type ProductLineRow = {
  id: string;
  slug: ProductLineSlug;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  hero_images: string[];
  sort_order: number;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  slug: string;
  primary_category: ProductCategory;
  line_slug: ProductLineSlug;
  name: string;
  price_cents: number;
  currency: "USD";
  summary: string;
  description: string;
  images: string[];
  color_options: string[];
  color_images: Record<string, string[]>;
  details: string[];
  detail_eyebrow: string;
  detail_title: string;
  comparison_eyebrow: string;
  comparison_title: string;
  specs: Record<string, ProductSpecValue>;
  is_best_seller: boolean;
  sort_order: number;
  status: "draft" | "published";
};

type ReviewRow = {
  id: string;
  author_name: string;
  location: string;
  rating: number;
  body: string;
  sort_order: number;
  is_active: boolean;
};

type SupportConversationRow = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  subject: string;
  status: "open" | "pending" | "archived";
  unread_count: number;
  last_message: string;
  last_message_at: string;
  created_at: string;
};

type SupportMessageRow = {
  id: string;
  conversation_id: string;
  sender: "user" | "support" | "system";
  body: string;
  is_read: boolean;
  created_at: string;
};

type SupportInboxData = {
  configured: boolean;
  conversations: SupportConversationRow[];
  selectedConversationId: string | null;
  messages: SupportMessageRow[];
};

type AdminData = {
  configured: boolean;
  message?: string;
  homeContent: HomeContent;
  heroSlides: HeroSlideRow[];
  productLines: ProductLineRow[];
  products: ProductRow[];
  reviews: ReviewRow[];
};

type ModuleKey = "dashboard" | "products" | "orders" | "customers" | "marketing" | "support";
type ProductSectionKey = "products" | "best-sellers" | "home-config" | "list-pages";
type ProductSectionGroupKey = "catalog" | "pages";

const modules: Array<{ key: ModuleKey; label: string; description: string; icon: typeof BarChart3 }> = [
  { key: "dashboard", label: "仪表盘", description: "数据看板", icon: BarChart3 },
  { key: "products", label: "商品中心", description: "商品、图片、页面配置", icon: Boxes },
  { key: "orders", label: "订单管理中心", description: "订单履约与售后", icon: ClipboardList },
  { key: "customers", label: "客户/会员管理", description: "会员档案与分层", icon: Users },
  { key: "marketing", label: "营销推广", description: "活动、优惠与转化", icon: Megaphone },
  { key: "support", label: "客服消息", description: "消息、回复、存档", icon: MessageSquareText }
];

const productSectionGroups: Array<{
  key: ProductSectionGroupKey;
  label: string;
  children: Array<{ key: ProductSectionKey; label: string }>;
}> = [
  {
    key: "catalog",
    label: "商品管理",
    children: [
      { key: "products", label: "商品管理" },
      { key: "best-sellers", label: "Best Seller 设置" }
    ]
  },
  {
    key: "pages",
    label: "页面管理",
    children: [
      { key: "home-config", label: "首页配置管理" },
      { key: "list-pages", label: "产品列表页管理" }
    ]
  }
];

const moduleSubmenus: Record<Exclude<ModuleKey, "products">, Array<{ key: string; label: string }>> = {
  dashboard: [
    { key: "overview", label: "运营总览" },
    { key: "tasks", label: "待办提醒" }
  ],
  orders: [
    { key: "all", label: "全部订单" },
    { key: "shipping", label: "待发货" },
    { key: "after-sales", label: "售后/退款" }
  ],
  customers: [
    { key: "members", label: "会员列表" },
    { key: "segments", label: "客户分群" },
    { key: "service", label: "服务记录" }
  ],
  marketing: [
    { key: "campaigns", label: "活动管理" },
    { key: "coupons", label: "优惠券" },
    { key: "materials", label: "推广素材" }
  ],
  support: [
    { key: "messages", label: "消息列表" },
    { key: "unread", label: "未读提醒" },
    { key: "quick-reply", label: "一键回复" },
    { key: "archive", label: "历史对话存档" }
  ]
};

const inputClass = "w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#078b8b] focus:ring-2 focus:ring-[#078b8b]/20";
const labelClass = "grid gap-2 text-sm font-medium text-slate-700";
const buttonClass = "inline-flex items-center justify-center gap-2 bg-[#078b8b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#056f6f] disabled:cursor-not-allowed disabled:opacity-60";

const fallbackAdminData: AdminData = {
  configured: false,
  message: "后台接口暂时不可用，已进入降级预览模式。",
  homeContent: fallbackHomeContent,
  heroSlides: heroSlides.map((slide, index) => ({
    id: slide.id,
    image: slide.image,
    eyebrow: slide.eyebrow,
    title: slide.title,
    copy: slide.copy,
    sort_order: index,
    is_active: true
  })),
  productLines: productLines.map((line) => ({
    id: line.id,
    slug: line.slug,
    name: line.name,
    eyebrow: line.eyebrow,
    tagline: line.tagline,
    description: line.description,
    hero_images: line.heroImages,
    sort_order: line.sortOrder,
    is_active: true
  })),
  products: products.map((product) => ({
    id: product.id,
    slug: product.slug,
    primary_category: "efoils",
    line_slug: product.lineSlug,
    name: product.name,
    price_cents: product.priceCents,
    currency: product.currency,
    summary: product.summary,
    description: product.description,
    images: product.images,
    color_options: product.colorOptions,
    color_images: product.colorImages ?? {},
    details: product.details,
    detail_eyebrow: product.detailEyebrow ?? "Product Details",
    detail_title: product.detailTitle ?? "Built for refined electric flight.",
    comparison_eyebrow: product.comparisonEyebrow ?? "Series Comparison",
    comparison_title: product.comparisonTitle ?? "Compare models in this series.",
    specs: product.specs,
    is_best_seller: product.isBestSeller,
    sort_order: product.sortOrder,
    status: "published"
  })),
  reviews: reviews.map((review, index) => ({
    id: review.id,
    author_name: review.authorName,
    location: review.location,
    rating: review.rating,
    body: review.body,
    sort_order: index,
    is_active: true
  }))
};

function linesToArray(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function arrayToLines(value?: string[]) {
  return (value ?? []).join("\n");
}

function isImageValue(value: string) {
  return /^https?:\/\//.test(value) && (/\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(value) || value.includes("/storage/v1/object/public/"));
}

function getSpecText(value: ProductSpecValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return isImageValue(value) ? "" : value;
  return value.text ?? "";
}

function getSpecImage(value: ProductSpecValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return isImageValue(value) ? value : "";
  return value.image ?? "";
}

function setSpecTextValue(current: ProductSpecValue | undefined, text: string): ProductSpecValue {
  const image = getSpecImage(current);
  if (image && text) return { text, image };
  if (image) return { image };
  return text;
}

function setSpecImageValue(current: ProductSpecValue | undefined, image: string): ProductSpecValue {
  const text = getSpecText(current);
  return text ? { text, image } : { image };
}

function specsToText(value?: Record<string, ProductSpecValue>) {
  return Object.entries(value ?? {})
    .map(([key, item]) => {
      const text = getSpecText(item);
      return text ? `${key}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

function textToKeyValues(value: string) {
  return Object.fromEntries(
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return [key.trim(), rest.join(":").trim()];
      })
      .filter(([key, item]) => key && item)
  ) as Record<string, string>;
}

function textToSpecs(value: string, current: Record<string, ProductSpecValue> = {}) {
  const nextTextEntries = textToKeyValues(value);

  const nextSpecs: Record<string, ProductSpecValue> = {};

  Object.entries(current).forEach(([key, item]) => {
    const image = getSpecImage(item);
    if (image) nextSpecs[key] = { image };
  });

  Object.entries(nextTextEntries).forEach(([key, text]) => {
    nextSpecs[key] = setSpecTextValue(nextSpecs[key], text);
  });

  return nextSpecs;
}

function uid(prefix: string, seed: string) {
  const slug = seed.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${prefix}-${slug || Date.now()}`;
}

export function AdminConsole() {
  const [draftToken, setDraftToken] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [activeModule, setActiveModule] = useState<ModuleKey>("dashboard");
  const [activeProductSection, setActiveProductSection] = useState<ProductSectionKey>("products");
  const [expandedProductGroup, setExpandedProductGroup] = useState<ProductSectionGroupKey | null>(null);
  const [activeModuleSubmenu, setActiveModuleSubmenu] = useState<Record<Exclude<ModuleKey, "products">, string>>({
    dashboard: "overview",
    orders: "all",
    customers: "members",
    marketing: "campaigns",
    support: "messages"
  });
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({ slides: 0, lines: 0, products: 0, reviews: 0 });
  const [uploadUrl, setUploadUrl] = useState("");
  const [supportInbox, setSupportInbox] = useState<SupportInboxData>({
    configured: false,
    conversations: [],
    selectedConversationId: null,
    messages: []
  });
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportReply, setSupportReply] = useState("");
  const [selectedListPageLine, setSelectedListPageLine] = useState(0);

  const headers = useMemo(() => (adminToken ? { "x-admin-token": adminToken } : undefined), [adminToken]);

  const loadData = useCallback(async (nextToken = "") => {
    setLoading(true);
    setError("");
    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);
      const response = await fetch("/api/admin/content", {
        headers: nextToken ? { "x-admin-token": nextToken } : undefined,
        signal: controller.signal
      });
      window.clearTimeout(timeoutId);

      const payload = await response.json().catch(() => ({}));
      if (response.status === 401) throw new Error(payload.error ?? "管理口令不正确");
      if (!response.ok) {
        setAdminToken(nextToken);
        setData(fallbackAdminData);
        setStatus("后台接口暂时不可用，已进入降级预览模式。");
        setError(payload.error ?? `后台接口返回 ${response.status}，请检查 Vercel 环境变量和部署日志。`);
        return true;
      }
      setAdminToken(nextToken);
      setData(payload);
      setStatus(payload.message ?? "后台数据已加载");
      return true;
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "后台数据读取失败";
      if (message.includes("Invalid admin token") || message.includes("管理口令不正确")) {
        setData(null);
        setAdminToken("");
        setError(message);
        return false;
      }

      setAdminToken(nextToken);
      setData(fallbackAdminData);
      setStatus("后台接口暂时不可用，已进入降级预览模式。");
      setError(message === "The operation was aborted." ? "后台接口请求超时，请检查 Vercel 部署是否已更新，以及 Supabase 环境变量是否正确。" : message);
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSupportInbox = useCallback(async (conversationId?: string) => {
    setSupportLoading(true);
    try {
      const suffix = conversationId ? `?conversationId=${encodeURIComponent(conversationId)}` : "";
      const response = await fetch(`/api/admin/support${suffix}`, { headers });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "客服消息读取失败");
      setSupportInbox({ ...payload, configured: payload.configured ?? true });
    } catch (supportError) {
      setError(supportError instanceof Error ? supportError.message : "客服消息读取失败");
    } finally {
      setSupportLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem("hydroglide_admin_token") ?? "";
    setDraftToken(savedToken);

    if (savedToken) {
      void loadData(savedToken);
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      void loadData("");
    }
  }, [loadData]);

  useEffect(() => {
    if (activeModule === "support") {
      void loadSupportInbox(supportInbox.selectedConversationId ?? undefined);
    }
  }, [activeModule, loadSupportInbox, supportInbox.selectedConversationId]);

  async function saveHome() {
    if (!data) return;
    await savePayload({ content: data.homeContent }, "首页文案已保存");
  }

  async function saveRecord(table: string, record: Record<string, unknown>, message: string) {
    await savePayload({ table, record }, message);
  }

  async function saveBestSellerSettings(records: ProductRow[]) {
    await savePayload({ table: "products", records }, "Best Seller 设置已保存");
  }

  async function savePayload(payload: Record<string, unknown>, message: string) {
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "content-type": "application/json", ...(headers ?? {}) },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "保存失败");
      await loadData(adminToken);
      setStatus(message);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = new FormData(event.currentTarget).get("file");
    if (!(file instanceof File) || !file.name) return;

    setSaving(true);
    setError("");
    setUploadUrl("");
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", headers, body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "图片上传失败");
      setUploadUrl(result.url);
      setStatus("图片已上传，可复制链接到图片字段");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "图片上传失败");
    } finally {
      setSaving(false);
    }
  }

async function uploadFile(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/upload", { method: "POST", headers, body });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? "素材上传失败");
    return String(result.url);
  }

  async function saveListPageSettings(nextLine: ProductLineRow, nextHomeContent: HomeContent) {
    setSaving(true);
    setStatus("");
    setError("");

    try {
      const requestHeaders = { "content-type": "application/json", ...(headers ?? {}) };

      const [lineResponse, homeResponse] = await Promise.all([
        fetch("/api/admin/content", {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({ table: "product_lines", record: nextLine })
        }),
        fetch("/api/admin/content", {
          method: "POST",
          headers: requestHeaders,
          body: JSON.stringify({ content: nextHomeContent })
        })
      ]);

      const [lineResult, homeResult] = await Promise.all([
        lineResponse.json().catch(() => ({})),
        homeResponse.json().catch(() => ({}))
      ]);

      if (!lineResponse.ok) throw new Error(lineResult.error ?? "产品列表页系列配置保存失败");
      if (!homeResponse.ok) throw new Error(homeResult.error ?? "产品列表页视频配置保存失败");

      await loadData(adminToken);
      setStatus("产品列表页配置已保存");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "产品列表页配置保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function updateSupportInbox(action: "reply" | "mark_read" | "archive" | "reopen", conversationId: string, message?: string) {
    setSupportLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "content-type": "application/json", ...(headers ?? {}) },
        body: JSON.stringify({ action, conversationId, message })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "客服消息更新失败");
      setSupportInbox({ ...payload, configured: payload.configured ?? true });
      if (action === "reply") setSupportReply("");
      setStatus(action === "reply" ? "客服回复已发送" : "客服消息状态已更新");
    } catch (supportError) {
      setError(supportError instanceof Error ? supportError.message : "客服消息更新失败");
    } finally {
      setSupportLoading(false);
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextToken = draftToken.trim();
    const ok = await loadData(nextToken);

    if (ok) {
      window.localStorage.setItem("hydroglide_admin_token", nextToken);
    } else {
      window.localStorage.removeItem("hydroglide_admin_token");
    }
  }

  function updateHome(nextContent: HomeContent) {
    setData((current) => (current ? { ...current, homeContent: nextContent } : current));
  }

  function updateCollection<K extends "heroSlides" | "productLines" | "products" | "reviews">(key: K, index: number, value: AdminData[K][number]) {
    setData((current) => {
      if (!current) return current;
      const nextItems = [...current[key]] as AdminData[K];
      nextItems[index] = value as never;
      return { ...current, [key]: nextItems };
    });
  }

  function addProduct() {
    const product: ProductRow = {
      id: `prod-${Date.now()}`,
      slug: `new-product-${Date.now()}`,
      primary_category: "efoils",
      line_slug: "lift-5f",
      name: "New Product",
      price_cents: 0,
      currency: "USD",
      summary: "",
      description: "",
      images: [],
      color_options: [],
      color_images: {},
      details: [],
      detail_eyebrow: "Product Details",
      detail_title: "Built for refined electric flight.",
      comparison_eyebrow: "Series Comparison",
      comparison_title: "Compare models in this series.",
      specs: {},
      is_best_seller: false,
      sort_order: data?.products.length ?? 0,
      status: "published"
    };
    setData((current) => (current ? { ...current, products: [...current.products, product] } : current));
    setSelected((current) => ({ ...current, products: data?.products.length ?? 0 }));
    setActiveModule("products");
    setActiveProductSection("products");
  }

  if (!data && !loading) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
        <form onSubmit={login} className="mx-auto mt-24 grid max-w-md gap-5 bg-white p-8 text-slate-900 shadow-2xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#078b8b]">Hydroglide Admin</p>
            <h1 className="mt-3 text-3xl font-semibold">后台运营配置</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">输入部署环境中的 ADMIN_ACCESS_TOKEN 后进入后台。</p>
          </div>
          <label className={labelClass}>
            管理口令
            <input className={inputClass} type="password" value={draftToken} onChange={(event) => setDraftToken(event.target.value)} />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className={buttonClass} type="submit">进入后台</button>
        </form>
      </main>
    );
  }

  const slide = data?.heroSlides[selected.slides];
  const product = data?.products[selected.products];
  const review = data?.reviews[selected.reviews];
  const storefrontLineEntries = (data?.productLines
    ? storefrontLineOptions
        .map((option) => {
          const index = data.productLines.findIndex((item) => item.slug === option.value);
          if (index < 0) return null;
          return {
            label: option.label,
            category: option.category,
            index,
            record: data.productLines[index]
          };
        })
        .filter(Boolean)
    : []) as Array<{ label: string; category: ProductCategory; index: number; record: ProductLineRow }>;
  const activeListPageEntry = storefrontLineEntries[selectedListPageLine] ?? storefrontLineEntries[0] ?? null;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#078b8b]">Hydroglide Admin</p>
            <h1 className="mt-1 text-xl font-semibold">后台运营配置系统</h1>
          </div>
          <form onSubmit={login} className="flex min-w-0 gap-2">
            <input className={`${inputClass} w-56`} type="password" placeholder="ADMIN_ACCESS_TOKEN" value={draftToken} onChange={(event) => setDraftToken(event.target.value)} />
            <button className={buttonClass} type="submit">验证</button>
          </form>
        </div>
      </div>

      <div className="grid gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit bg-white p-2 shadow-sm">
          <nav className="grid gap-1">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.key} className="grid gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModule(module.key);
                      if (module.key === "products") setExpandedProductGroup(null);
                    }}
                    className={`flex items-start gap-3 px-3 py-2.5 text-left transition ${activeModule === module.key ? "bg-[#078b8b] text-white" : "text-slate-700 hover:bg-slate-100"}`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="block text-sm font-semibold">{module.label}</span>
                      <span className={`mt-0.5 block text-xs ${activeModule === module.key ? "text-white/80" : "text-slate-500"}`}>{module.description}</span>
                    </span>
                  </button>
                  {activeModule === module.key ? (
                    <div className="ml-5 border-l border-slate-200 py-1 pl-2">
                      {module.key === "products"
                        ? productSectionGroups.map((group) => {
                            const expanded = expandedProductGroup === group.key;
                            const containsActiveSection = group.children.some((item) => item.key === activeProductSection);
                            return (
                              <div key={group.key} className="mb-1 last:mb-0">
                                <button
                                  type="button"
                                  aria-expanded={expanded}
                                  onClick={() => setExpandedProductGroup(expanded ? null : group.key)}
                                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold transition ${
                                    expanded ? "bg-slate-100 text-slate-950" : containsActiveSection ? "text-[#078b8b]" : "text-slate-700 hover:bg-slate-100"
                                  }`}
                                >
                                  <span>{group.label}</span>
                                  {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                {expanded ? (
                                  <div className="ml-3 mt-1 grid gap-1 border-l border-slate-200 pl-2">
                                    {group.children.map((item) => {
                                      const activeChild = activeProductSection === item.key;
                                      return (
                                        <button
                                          key={item.key}
                                          type="button"
                                          onClick={() => {
                                            setActiveModule(module.key);
                                            setActiveProductSection(item.key);
                                          }}
                                          className={`block w-full px-3 py-2 text-left text-sm transition ${
                                            activeChild ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                          }`}
                                        >
                                          {item.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        : moduleSubmenus[module.key].map((item) => {
                            const submenuKey = module.key as Exclude<ModuleKey, "products">;
                            const activeChild = activeModuleSubmenu[submenuKey] === item.key;
                            return (
                              <button
                                key={item.key}
                                type="button"
                                onClick={() => {
                                  setActiveModule(module.key);
                                  setActiveModuleSubmenu((current) => ({ ...current, [submenuKey]: item.key }));
                                }}
                                className={`block w-full px-3 py-2 text-left text-sm transition ${
                                  activeChild ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 bg-white p-4 shadow-sm">
          {loading ? (
            <div className="flex items-center gap-3 text-sm text-slate-600"><Loader2 className="h-4 w-4 animate-spin" /> 正在加载后台数据...</div>
          ) : null}
          {status ? <p className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{status}</p> : null}
          {error ? <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          {data?.configured === false ? <p className="mb-5 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">当前后台处于降级预览模式。请检查 Vercel 环境变量和 Supabase 表结构，配置完成后即可正常保存真实数据。</p> : null}

          {activeModule === "dashboard" && data ? <DashboardPanel data={data} /> : null}
          {activeModule === "orders" ? <CenterPlaceholder title="订单管理中心" description="集中查看订单状态、支付、物流、售后与退款。订单数据表接入后，这里会成为订单履约工作台。" items={["待付款 / 待发货 / 已完成订单分组", "订单详情、收货信息、物流单号", "退款、换货、售后处理记录"]} /> : null}
          {activeModule === "customers" ? <CenterPlaceholder title="客户/会员管理" description="沉淀客户资料、会员等级、购买记录和服务跟进。会员数据接入后可用于精细化运营。" items={["客户列表与会员等级", "购买次数、累计消费、最近活跃", "标签分群、备注、服务记录"]} /> : null}
          {activeModule === "marketing" ? <CenterPlaceholder title="营销推广" description="管理优惠活动、首页推荐、邮件订阅和投放素材。后续可接入优惠码、活动页和转化数据。" items={["优惠券、满减、限时活动", "首页推荐位和热卖组合", "订阅用户、EDM、广告素材"]} /> : null}
          {activeModule === "support" ? (
            <SupportMessagesPanel
              activeSection={activeModuleSubmenu.support}
              inbox={supportInbox}
              loading={supportLoading}
              reply={supportReply}
              onReplyChange={setSupportReply}
              onSelectConversation={(conversationId) => void loadSupportInbox(conversationId)}
              onMarkRead={(conversationId) => void updateSupportInbox("mark_read", conversationId)}
              onArchive={(conversationId) => void updateSupportInbox("archive", conversationId)}
              onReopen={(conversationId) => void updateSupportInbox("reopen", conversationId)}
              onSendReply={(conversationId) => void updateSupportInbox("reply", conversationId, supportReply)}
            />
          ) : null}

          {activeModule === "products" ? (
            <div className="mb-4">
              <SectionTitle title="商品中心" />
              <p className="mt-2 text-sm text-slate-500">通过左侧子菜单管理商品、系列、首页内容和素材。</p>
            </div>
          ) : null}

          {activeModule === "products" && activeProductSection === "home-config" && data ? (
            <div className="grid gap-5">
              <SectionTitle title="首页配置管理" />
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                这里统一管理首页文案、Hero 图片/视频、首页轮播图、评论评级和素材上传，不再拆分多个入口。
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>首页视频地址<input className={inputClass} value={data.homeContent.hero.videoSrc} onChange={(event) => updateHome({ ...data.homeContent, hero: { ...data.homeContent.hero, videoSrc: event.target.value } })} /></label>
                <label className={labelClass}>Hero 标题<input className={inputClass} value={data.homeContent.hero.title} onChange={(event) => updateHome({ ...data.homeContent, hero: { ...data.homeContent.hero, title: event.target.value } })} /></label>
              </div>
              <label className={labelClass}>Hero 文案<textarea className={inputClass} rows={3} value={data.homeContent.hero.copy} onChange={(event) => updateHome({ ...data.homeContent, hero: { ...data.homeContent.hero, copy: event.target.value } })} /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <TextBlock label="产品系列标题" value={data.homeContent.productLines.title} onChange={(value) => updateHome({ ...data.homeContent, productLines: { ...data.homeContent.productLines, title: value } })} />
                <TextBlock label="热卖标题" value={data.homeContent.bestSellers.title} onChange={(value) => updateHome({ ...data.homeContent, bestSellers: { ...data.homeContent.bestSellers, title: value } })} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>产品系列文案<textarea className={inputClass} rows={4} value={data.homeContent.productLines.copy} onChange={(event) => updateHome({ ...data.homeContent, productLines: { ...data.homeContent.productLines, copy: event.target.value } })} /></label>
                <label className={labelClass}>热卖区文案<textarea className={inputClass} rows={4} value={data.homeContent.bestSellers.copy} onChange={(event) => updateHome({ ...data.homeContent, bestSellers: { ...data.homeContent.bestSellers, copy: event.target.value } })} /></label>
              </div>
              <label className={labelClass}>首页系列推荐商品（每行 系列slug: 产品slug）<textarea className={inputClass} rows={4} value={specsToText(data.homeContent.productLines.featuredProductSlugs)} onChange={(event) => updateHome({ ...data.homeContent, productLines: { ...data.homeContent.productLines, featuredProductSlugs: textToKeyValues(event.target.value) } })} /></label>
              <label className={labelClass}>系列页视频地址（每行 系列slug: 视频URL）<textarea className={inputClass} rows={4} value={specsToText(data.homeContent.productLines.heroVideos)} onChange={(event) => updateHome({ ...data.homeContent, productLines: { ...data.homeContent.productLines, heroVideos: textToKeyValues(event.target.value) } })} /></label>
              <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                首页 Best Sellers 现在只读取“Best Seller 设置”专区中的商品，不再使用手动填写 slug 的方式。
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextBlock label="评价区标题" value={data.homeContent.reviews.title} onChange={(value) => updateHome({ ...data.homeContent, reviews: { ...data.homeContent.reviews, title: value } })} />
                <label className={labelClass}>评价区文案<textarea className={inputClass} rows={4} value={data.homeContent.reviews.copy} onChange={(event) => updateHome({ ...data.homeContent, reviews: { ...data.homeContent.reviews, copy: event.target.value } })} /></label>
              </div>
              <button type="button" disabled={saving} onClick={saveHome} className={buttonClass}><Save className="h-4 w-4" /> 保存首页文案</button>

              <div className="border-t border-slate-200 pt-6">
                <SectionTitle title="首页轮播图管理" />
                <p className="mt-2 text-sm text-slate-500">维护首页 Hero 轮播的图片、标题、文案和排序。</p>
              </div>
              {slide ? (
                <RecordEditor items={data.heroSlides} selected={selected.slides} labelKey="title" onSelect={(index) => setSelected((current) => ({ ...current, slides: index }))}>
                  <div className="grid gap-4">
                    <TextBlock label="图片 URL" value={slide.image} onChange={(value) => updateCollection("heroSlides", selected.slides, { ...slide, image: value })} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextBlock label="眉标" value={slide.eyebrow} onChange={(value) => updateCollection("heroSlides", selected.slides, { ...slide, eyebrow: value })} />
                      <TextBlock label="标题" value={slide.title} onChange={(value) => updateCollection("heroSlides", selected.slides, { ...slide, title: value })} />
                    </div>
                    <label className={labelClass}>文案<textarea className={inputClass} rows={4} value={slide.copy} onChange={(event) => updateCollection("heroSlides", selected.slides, { ...slide, copy: event.target.value })} /></label>
                    <ToggleRow active={slide.is_active} order={slide.sort_order} onActive={(value) => updateCollection("heroSlides", selected.slides, { ...slide, is_active: value })} onOrder={(value) => updateCollection("heroSlides", selected.slides, { ...slide, sort_order: value })} />
                    <button type="button" disabled={saving} onClick={() => saveRecord("hero_slides", slide, "轮播图已保存")} className={buttonClass}><Save className="h-4 w-4" /> 保存轮播图</button>
                  </div>
                </RecordEditor>
              ) : null}

              <div className="border-t border-slate-200 pt-6">
                <SectionTitle title="首页评价 / 评级管理" />
                <p className="mt-2 text-sm text-slate-500">统一管理首页 Reviews 区块的姓名、地区、评分和评价内容。</p>
              </div>
              {review ? (
                <RecordEditor items={data.reviews} selected={selected.reviews} labelKey="author_name" onSelect={(index) => setSelected((current) => ({ ...current, reviews: index }))}>
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <TextBlock label="姓名" value={review.author_name} onChange={(value) => updateCollection("reviews", selected.reviews, { ...review, author_name: value })} />
                      <TextBlock label="地区" value={review.location} onChange={(value) => updateCollection("reviews", selected.reviews, { ...review, location: value })} />
                      <label className={labelClass}>评分<input className={inputClass} type="number" min={1} max={5} value={review.rating} onChange={(event) => updateCollection("reviews", selected.reviews, { ...review, rating: Number(event.target.value) })} /></label>
                    </div>
                    <label className={labelClass}>评价内容<textarea className={inputClass} rows={4} value={review.body} onChange={(event) => updateCollection("reviews", selected.reviews, { ...review, body: event.target.value })} /></label>
                    <ToggleRow active={review.is_active} order={review.sort_order} onActive={(value) => updateCollection("reviews", selected.reviews, { ...review, is_active: value })} onOrder={(value) => updateCollection("reviews", selected.reviews, { ...review, sort_order: value })} />
                    <button type="button" disabled={saving} onClick={() => saveRecord("reviews", review, "评价已保存")} className={buttonClass}><Save className="h-4 w-4" /> 保存评价</button>
                  </div>
                </RecordEditor>
              ) : null}

              <div className="border-t border-slate-200 pt-6">
                <SectionTitle title="首页素材上传" />
                <p className="mt-2 text-sm text-slate-500">上传首页需要用到的图片素材，上传后会返回公开 URL，可直接用于首页或产品列表页配置。</p>
              </div>
              <form onSubmit={uploadImage} className="grid gap-4 border border-dashed border-slate-300 p-6">
                <ImagePlus className="h-8 w-8 text-[#078b8b]" />
                <label className={labelClass}>选择网页图片<input className={inputClass} name="file" type="file" accept="image/*" /></label>
                <button type="submit" disabled={saving} className={buttonClass}><UploadCloud className="h-4 w-4" /> 上传到素材库</button>
              </form>
              {uploadUrl ? (
                <label className={labelClass}>上传后的公开 URL<input className={inputClass} readOnly value={uploadUrl} onFocus={(event) => event.currentTarget.select()} /></label>
              ) : null}
            </div>
          ) : null}

          {activeModule === "products" && activeProductSection === "best-sellers" && data ? (
            <BestSellerSettingsPanel
              products={data.products}
              saving={saving}
              onChange={(products) => setData((current) => (current ? { ...current, products } : current))}
              onSave={(products) => void saveBestSellerSettings(products)}
            />
          ) : null}

          {activeModule === "products" && activeProductSection === "list-pages" && activeListPageEntry && data ? (
            <RecordEditor
              items={storefrontLineEntries}
              selected={selectedListPageLine}
              labelKey="label"
              onSelect={setSelectedListPageLine}
            >
              <ListPageSettingsPanel
                line={activeListPageEntry.record}
                homeContent={data.homeContent}
                saving={saving}
                navigationLabel={activeListPageEntry.label}
                categoryLabel={activeListPageEntry.category === "efoils" ? "Hydrotherapy Equipment" : "HydroSport Equipment"}
                onLineChange={(nextLine) => updateCollection("productLines", activeListPageEntry.index, nextLine)}
                onHomeChange={updateHome}
                onSave={(nextLine, nextHomeContent) => void saveListPageSettings(nextLine, nextHomeContent)}
                uploadFile={uploadFile}
              />
            </RecordEditor>
          ) : null}

          {activeModule === "products" && activeProductSection === "products" && product ? (
            <div className="grid gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <SectionTitle title="商品管理" />
                  <p className="mt-2 text-sm text-slate-500">在这里维护商品资料、图片、价格、详情卖点和参数内容。新增产品功能已整合在这里。</p>
                </div>
                <button type="button" onClick={addProduct} className="inline-flex items-center justify-center gap-2 border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                  <Plus className="h-4 w-4" /> 新增产品
                </button>
              </div>
              <RecordEditor items={data?.products ?? []} selected={selected.products} labelKey="name" onSelect={(index) => setSelected((current) => ({ ...current, products: index }))}>
                <ProductForm
                  product={product}
                  saving={saving}
                  update={(next) => updateCollection("products", selected.products, next)}
                  save={() => saveRecord("products", product, "产品已保存")}
                  uploadFile={uploadFile}
                />
              </RecordEditor>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function DashboardPanel({ data }: { data: AdminData }) {
  const publishedProducts = data.products.filter((product) => product.status === "published").length;
  const draftProducts = data.products.filter((product) => product.status === "draft").length;
  const activeSlides = data.heroSlides.filter((slide) => slide.is_active).length;
  const activeReviews = data.reviews.filter((review) => review.is_active).length;
  const cards = [
    { label: "商品总数", value: data.products.length, note: `${publishedProducts} 个已发布，${draftProducts} 个草稿` },
    { label: "产品系列", value: data.productLines.length, note: "前台 Hydrotherapy / HydroSport 系列导航数据" },
    { label: "轮播图", value: data.heroSlides.length, note: `${activeSlides} 张正在前台展示` },
    { label: "客户评价", value: data.reviews.length, note: `${activeReviews} 条已启用` }
  ];

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#078b8b]">Dashboard</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">仪表盘</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">快速查看当前网站运营配置状态。订单、客户和营销数据接入后会继续扩展到这里。</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <strong className="mt-3 block text-3xl font-semibold text-slate-950">{card.value}</strong>
            <p className="mt-3 text-sm leading-5 text-slate-600">{card.note}</p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="border border-slate-200 p-5">
          <h3 className="text-base font-semibold text-slate-950">待办提醒</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p>检查草稿商品：{draftProducts} 个商品尚未发布。</p>
            <p>维护首页内容：可在商品中心的首页文案、轮播图中更新前台展示。</p>
            <p>上传新素材：商品中心的图片上传可生成公开图片链接。</p>
          </div>
        </article>
        <article className="border border-slate-200 p-5">
          <h3 className="text-base font-semibold text-slate-950">快捷入口</h3>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <p>商品中心：维护产品、系列、图片、首页内容。</p>
            <p>订单管理中心：预留订单履约工作流。</p>
            <p>客户/会员管理：预留客户分层和会员运营。</p>
          </div>
        </article>
      </div>
    </div>
  );
}

function CenterPlaceholder({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <div className="grid gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#078b8b]">Operations</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="border border-dashed border-slate-300 bg-slate-50 p-6">
        <p className="text-sm font-semibold text-slate-900">规划功能</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListPageSettingsPanel({
  line,
  homeContent,
  saving,
  navigationLabel,
  categoryLabel,
  onLineChange,
  onHomeChange,
  onSave,
  uploadFile
}: {
  line: ProductLineRow;
  homeContent: HomeContent;
  saving: boolean;
  navigationLabel: string;
  categoryLabel: string;
  onLineChange: (line: ProductLineRow) => void;
  onHomeChange: (content: HomeContent) => void;
  onSave: (line: ProductLineRow, content: HomeContent) => void;
  uploadFile: (file: File) => Promise<string>;
}) {
  const videoSrc = homeContent.productLines.heroVideos[line.slug] ?? "";
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [assetError, setAssetError] = useState("");

  function updateVideo(nextVideo: string) {
    onHomeChange({
      ...homeContent,
      productLines: {
        ...homeContent.productLines,
        heroVideos: {
          ...homeContent.productLines.heroVideos,
          [line.slug]: nextVideo.trim()
        }
      }
    });
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    setUploadingImages(true);
    setAssetError("");
    try {
      const uploaded = await Promise.all(files.map((file) => uploadFile(file)));
      onLineChange({
        ...line,
        hero_images: [...line.hero_images, ...uploaded]
      });
    } catch (error) {
      setAssetError(error instanceof Error ? error.message : "轮播图上传失败");
    } finally {
      setUploadingImages(false);
      input.value = "";
    }
  }

  async function handleVideoUpload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setAssetError("");
    try {
      const uploaded = await uploadFile(file);
      updateVideo(uploaded);
    } catch (error) {
      setAssetError(error instanceof Error ? error.message : "视频上传失败");
    } finally {
      setUploadingVideo(false);
      input.value = "";
    }
  }

  return (
    <div className="grid gap-5">
      <SectionTitle title="产品系列 / 列表页管理" />
      <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        当前系列属于 <strong>{categoryLabel}</strong>，导航下拉名称为 <strong>{navigationLabel}</strong>。这里统一配置这一项对应的列表页 Hero 标题、系列介绍、轮播图和视频。若填写了视频地址，前台会优先播放视频；留空则自动切换轮播图。
      </div>
      {assetError ? <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{assetError}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <TextBlock label="Hero 小标题" value={line.eyebrow} onChange={(value) => onLineChange({ ...line, eyebrow: value })} />
        <TextBlock label="Hero 主标题" value={line.name} onChange={(value) => onLineChange({ ...line, name: value })} />
      </div>
      <label className={labelClass}>
        产品系列文字介绍
        <textarea
          className={inputClass}
          rows={4}
          value={line.description}
          onChange={(event) => onLineChange({ ...line, description: event.target.value })}
        />
      </label>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="grid gap-3 border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">轮播图管理</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">建议尺寸 2400 x 1400px，最多保留 3-5 张。仅上传 1 张时，前台将静态展示。</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <UploadCloud className="h-4 w-4" />
              {uploadingImages ? "上传中..." : "上传轮播图"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          <textarea
            className={inputClass}
            rows={5}
            value={arrayToLines(line.hero_images)}
            onChange={(event) => onLineChange({ ...line, hero_images: linesToArray(event.target.value) })}
            placeholder="也可直接粘贴图片 URL，每行一个"
          />
          {line.hero_images.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {line.hero_images.map((image, index) => (
                <div key={`${image}-${index}`} className="grid gap-2 border border-slate-200 bg-slate-50 p-2">
                  <div className="relative aspect-[4/3] overflow-hidden bg-white">
                    <Image src={image} alt="" fill sizes="240px" className="object-cover" />
                  </div>
                  <button
                    type="button"
                    className="border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white"
                    onClick={() => onLineChange({ ...line, hero_images: line.hero_images.filter((_, imageIndex) => imageIndex !== index) })}
                  >
                    删除图片
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">当前还没有上传轮播图。</p>
          )}
        </div>

        <div className="grid gap-3 border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950">视频管理</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">建议 MP4 / MOV，16:9 或 21:9 横版素材。上传后会自动覆盖当前系列视频地址。</p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <UploadCloud className="h-4 w-4" />
              {uploadingVideo ? "上传中..." : "上传视频"}
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
          </div>
          <TextBlock label="视频 URL" value={videoSrc} onChange={updateVideo} />
          {videoSrc ? (
            <div className="grid gap-2">
              <video className="aspect-video w-full bg-slate-950 object-cover" src={videoSrc} controls preload="metadata" />
              <button
                type="button"
                className="border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => updateVideo("")}
              >
                清空视频，改用轮播图
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500">当前未设置视频，前台会读取左侧轮播图。</p>
          )}
        </div>
      </div>
      <button type="button" disabled={saving || uploadingImages || uploadingVideo} onClick={() => onSave(line, homeContent)} className={buttonClass}>
        <Save className="h-4 w-4" /> 保存产品列表页配置
      </button>
    </div>
  );
}

function BestSellerSettingsPanel({
  products,
  saving,
  onChange,
  onSave
}: {
  products: ProductRow[];
  saving: boolean;
  onChange: (products: ProductRow[]) => void;
  onSave: (products: ProductRow[]) => void;
}) {
  const publishedProducts = products.filter((product) => product.status === "published");
  const selectedProducts = publishedProducts
    .filter((product) => product.is_best_seller)
    .sort((left, right) => left.sort_order - right.sort_order);
  const availableProducts = publishedProducts
    .filter((product) => !product.is_best_seller)
    .sort((left, right) => left.sort_order - right.sort_order);
  const selectedCount = selectedProducts.length;
  const isValidCount = selectedCount >= 1 && selectedCount <= 6;

  function setBestSeller(productId: string, isBestSeller: boolean) {
    onChange(
      products.map((product) => (product.id === productId ? { ...product, is_best_seller: isBestSeller } : product))
    );
  }

  return (
    <div className="grid gap-5">
      <SectionTitle title="Best Seller 设置专区" />
      <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        首页 Best Sellers 模块现在只读取这里的商品。有几个显示几个，最多展示 6 个，请在这里完成组合后再保存到前台。
      </div>
      <div className={`border px-4 py-3 text-sm font-medium ${isValidCount ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
        当前已选 {selectedCount} 个热卖商品。{isValidCount ? "数量符合前台展示规则，可直接保存。" : "请至少保留 1 个热卖商品，且最多选择 6 个。"}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="grid gap-3 border border-slate-200 p-4">
          <div>
            <h3 className="text-base font-semibold text-slate-950">已设为 Best Sellers</h3>
            <p className="mt-1 text-sm text-slate-500">这里的商品会进入首页热卖模块。</p>
          </div>
          <div className="grid gap-3">
            {selectedProducts.length ? selectedProducts.map((product) => (
              <article key={product.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                  <p className="mt-1 text-xs tracking-[0.08em] text-slate-500">{getProductLineDisplayName(product.line_slug)}</p>
                </div>
                <button
                  type="button"
                  className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setBestSeller(product.id, false)}
                >
                  取消热卖
                </button>
              </article>
            )) : (
              <div className="border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">还没有选中任何热卖商品。</div>
            )}
          </div>
        </div>

        <div className="grid gap-3 border border-slate-200 p-4">
          <div>
            <h3 className="text-base font-semibold text-slate-950">可加入 Best Sellers 的商品</h3>
            <p className="mt-1 text-sm text-slate-500">只显示已发布、且当前未加入热卖区的商品。</p>
          </div>
          <div className="grid gap-3">
            {availableProducts.length ? availableProducts.map((product) => (
              <article key={product.id} className="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                  <p className="mt-1 text-xs tracking-[0.08em] text-slate-500">{getProductLineDisplayName(product.line_slug)}</p>
                </div>
                <button
                  type="button"
                  disabled={selectedCount >= 6}
                  className="border border-[#078b8b] px-3 py-2 text-sm font-semibold text-[#078b8b] transition hover:bg-[#eefafa] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  onClick={() => setBestSeller(product.id, true)}
                >
                  加入热卖
                </button>
              </article>
            )) : (
              <div className="border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">没有更多可加入的已发布商品。</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">保存后首页热卖区会自动按排序展示已选商品，最多展示前 6 个。</p>
        <button
          type="button"
          disabled={saving || !isValidCount}
          onClick={() => onSave(products)}
          className={buttonClass}
        >
          <Save className="h-4 w-4" />
          保存 Best Seller 设置
        </button>
      </div>
    </div>
  );
}

function SupportMessagesPanel({
  activeSection,
  inbox,
  loading,
  reply,
  onReplyChange,
  onSelectConversation,
  onMarkRead,
  onArchive,
  onReopen,
  onSendReply
}: {
  activeSection: string;
  inbox: SupportInboxData;
  loading: boolean;
  reply: string;
  onReplyChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onMarkRead: (conversationId: string) => void;
  onArchive: (conversationId: string) => void;
  onReopen: (conversationId: string) => void;
  onSendReply: (conversationId: string) => void;
}) {
  const quickReplies = [
    "您好，感谢咨询。我们已收到您的问题，客服会尽快为您确认具体方案。",
    "Lift 5F Cruiser 官方续航最高约 120 分钟，实际时间会受体重、水况和速度影响。",
    "请提供订单号、购买邮箱和问题图片，我们会为您创建售后工单。"
  ];
  const unreadCount = inbox.conversations.reduce((total, item) => total + item.unread_count, 0);
  const selectedConversation = inbox.conversations.find((item) => item.id === inbox.selectedConversationId) ?? inbox.conversations[0];
  const activeConversations = inbox.conversations.filter((item) => item.status !== "archived");
  const unreadConversations = inbox.conversations.filter((item) => item.unread_count > 0);
  const archivedConversations = inbox.conversations.filter((item) => item.status === "archived");
  const visibleConversations =
    activeSection === "unread" ? unreadConversations : activeSection === "archive" ? archivedConversations : activeConversations;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#078b8b]">Support Inbox</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">客服消息</h2>
          <p className="mt-1 text-sm text-slate-500">集中处理咨询、未读提醒、快捷回复和历史对话存档。</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          <Bell className="h-4 w-4" />
          {unreadCount} 条未读
        </div>
      </div>
      {!inbox.configured ? <p className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">客服消息数据库暂未配置。请先执行 supabase/schema.sql 中的 support_conversations 和 support_messages 表结构。</p> : null}
      {loading ? <p className="text-sm text-slate-500">正在同步客服消息...</p> : null}

      {activeSection === "messages" || activeSection === "unread" ? (
        <div className="grid gap-4 xl:grid-cols-[340px_1fr]">
          <div className="max-h-[620px] overflow-auto border border-slate-200">
            {visibleConversations.length ? visibleConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`block w-full border-b border-slate-200 px-4 py-3 text-left transition ${
                  selectedConversation?.id === conversation.id ? "bg-slate-900 text-white" : conversation.unread_count ? "bg-[#eefafa] hover:bg-[#dff5f5]" : "bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{conversation.customer_name}</span>
                  {conversation.unread_count ? <span className="bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">{conversation.unread_count}</span> : null}
                </div>
                <p className={`mt-1 text-xs ${selectedConversation?.id === conversation.id ? "text-white/70" : "text-slate-500"}`}>{conversation.subject}</p>
                <p className={`mt-2 line-clamp-2 text-sm leading-5 ${selectedConversation?.id === conversation.id ? "text-white/80" : "text-slate-600"}`}>{conversation.last_message}</p>
              </button>
            )) : <p className="p-4 text-sm text-slate-500">暂无客服消息。</p>}
          </div>

          <div className="grid gap-4 border border-slate-200 p-4">
            {selectedConversation ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-950">{selectedConversation.customer_name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{selectedConversation.customer_email ?? "未留下邮箱"} · {selectedConversation.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => onMarkRead(selectedConversation.id)} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">标记已读</button>
                    <button type="button" onClick={() => onArchive(selectedConversation.id)} className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">归档</button>
                  </div>
                </div>
                <div className="max-h-[360px] overflow-auto bg-slate-50 p-4">
                  <div className="grid gap-3">
                    {inbox.messages.map((message) => (
                      <div key={message.id} className={`max-w-[82%] px-4 py-3 text-sm leading-6 ${message.sender === "user" ? "mr-auto bg-white text-slate-700" : "ml-auto bg-[#078b8b] text-white"}`}>
                        {message.body}
                      </div>
                    ))}
                  </div>
                </div>
                <label className={labelClass}>
                  回复内容
                  <textarea className={inputClass} rows={5} value={reply} onChange={(event) => onReplyChange(event.target.value)} placeholder="输入客服回复..." />
                </label>
                <button type="button" onClick={() => onSendReply(selectedConversation.id)} className={buttonClass}>
                  <Reply className="h-4 w-4" />
                  发送回复
                </button>
              </>
            ) : <p className="text-sm text-slate-500">请选择一条会话。</p>}
          </div>
        </div>
      ) : null}

      {activeSection === "quick-reply" ? (
        <div className="grid gap-4 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <Reply className="h-4 w-4" />
              一键回复模板
            </div>
            <div className="mt-4 grid gap-2">
              {quickReplies.map((reply) => (
                <button key={reply} type="button" onClick={() => onReplyChange(reply)} className="border border-slate-200 bg-white px-3 py-2 text-left text-sm leading-6 text-slate-700 transition hover:border-[#078b8b] hover:bg-[#eefafa]">
                  {reply}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-slate-200 p-4">
            <label className={labelClass}>
              回复内容
              <textarea className={inputClass} rows={8} value={reply} onChange={(event) => onReplyChange(event.target.value)} />
            </label>
            <button type="button" disabled={!selectedConversation} onClick={() => selectedConversation ? onSendReply(selectedConversation.id) : undefined} className={`${buttonClass} mt-4`}>
              <Reply className="h-4 w-4" />
              发送回复
            </button>
          </div>
        </div>
      ) : null}

      {activeSection === "archive" ? (
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Archive className="h-4 w-4" />
            历史对话存档
          </div>
        <div className="overflow-hidden border border-slate-200">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">存档编号</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">客户</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">主题</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">关闭日期</th>
                <th className="border-b border-slate-200 px-4 py-3 font-semibold">负责人</th>
              </tr>
            </thead>
            <tbody>
              {archivedConversations.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-950">{item.id.slice(0, 8)}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{item.customer_name}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{item.subject}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{new Date(item.last_message_at).toLocaleDateString()}</td>
                  <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                    <button type="button" onClick={() => onReopen(item.id)} className="font-semibold text-[#078b8b]">重新打开</button>
                  </td>
                </tr>
              ))}
              {!archivedConversations.length ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">暂无历史存档。</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="border-b border-slate-200 pb-4 text-xl font-semibold">{title}</h2>;
}

function TextBlock({
  label,
  value,
  onChange,
  helperText
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      <input className={inputClass} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
      {helperText ? <span className="text-xs font-normal leading-5 text-slate-500">{helperText}</span> : null}
    </label>
  );
}

function RecordEditor<T extends Record<string, unknown>>({
  items,
  selected,
  labelKey,
  onSelect,
  children
}: {
  items: T[];
  selected: number;
  labelKey: keyof T;
  onSelect: (index: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <div className="max-h-[72vh] overflow-auto border border-slate-200">
        {items.map((item, index) => (
          <button
            key={String(item.id ?? index)}
            type="button"
            onClick={() => onSelect(index)}
            className={`block w-full border-b border-slate-200 px-4 py-3 text-left text-sm ${selected === index ? "bg-slate-900 text-white" : "hover:bg-slate-50"}`}
          >
            {String(item[labelKey] ?? item.id ?? index)}
          </button>
        ))}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function ToggleRow({ active, order, onActive, onOrder }: { active: boolean; order: number; onActive: (value: boolean) => void; onOrder: (value: number) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input type="checkbox" checked={active} onChange={(event) => onActive(event.target.checked)} />
        前台显示
      </label>
      <label className={labelClass}>
        排序
        <NumberInput value={order} onChange={onOrder} />
      </label>
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <input
      className={inputClass}
      inputMode="numeric"
      type="text"
      value={draft}
      onFocus={() => {
        if (draft === "0") {
          setDraft("");
        }
      }}
      onBlur={() => {
        if (!draft.trim()) {
          setDraft("0");
          onChange(0);
        }
      }}
      onChange={(event) => {
        const nextValue = event.target.value.replace(/\D/g, "");

        setDraft(nextValue);

        if (nextValue) {
          onChange(Number(nextValue));
        }
      }}
    />
  );
}

function ProductForm({
  product,
  saving,
  update,
  save,
  uploadFile
}: {
  product: ProductRow;
  saving: boolean;
  update: (product: ProductRow) => void;
  save: () => void;
  uploadFile: (file: File) => Promise<string>;
}) {
  const [uploadingProductImages, setUploadingProductImages] = useState(false);
  const [uploadingColorImages, setUploadingColorImages] = useState(false);
  const [uploadingDetailImages, setUploadingDetailImages] = useState(false);
  const [uploadingSpecImage, setUploadingSpecImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [colorImageKey, setColorImageKey] = useState("");
  const [detailText, setDetailText] = useState("");
  const [specImageKey, setSpecImageKey] = useState("");
  const category = product.primary_category ?? "efoils";
  const lineOptions = (() => {
    const baseOptions = lineOptionsByCategory[category];
    if (baseOptions.some((option) => option.value === product.line_slug)) return baseOptions;

    return [
      ...baseOptions,
      {
        label: `${product.line_slug} (Legacy)`,
        value: product.line_slug
      }
    ];
  })();

  function updateCategory(nextCategory: ProductCategory) {
    const nextOptions = lineOptionsByCategory[nextCategory];
    const currentLineIsValid = nextOptions.some((option) => option.value === product.line_slug);

    update({
      ...product,
      primary_category: nextCategory,
      line_slug: currentLineIsValid ? product.line_slug : nextOptions[0].value
    });
  }

  async function uploadProductImages(files: FileList | null) {
    if (!files?.length) return;

    setUploadingProductImages(true);
    setUploadError("");

    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadFile(file)));
      update({ ...product, images: [...product.images, ...urls] });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "图片上传失败");
    } finally {
      setUploadingProductImages(false);
    }
  }

  async function uploadDetailImages(files: FileList | null) {
    if (!files?.length) return;

    setUploadingDetailImages(true);
    setUploadError("");

    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadFile(file)));
      update({ ...product, details: [...product.details, ...urls] });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "图片上传失败");
    } finally {
      setUploadingDetailImages(false);
    }
  }

  async function uploadColorImages(files: FileList | null) {
    const color = colorImageKey.trim() || product.color_options[0];

    if (!files?.length || !color) {
      setUploadError("请先填写或选择颜色名称");
      return;
    }

    setUploadingColorImages(true);
    setUploadError("");

    try {
      const urls = await Promise.all(Array.from(files).map((file) => uploadFile(file)));
      update({
        ...product,
        color_options: product.color_options.includes(color) ? product.color_options : [...product.color_options, color],
        color_images: {
          ...(product.color_images ?? {}),
          [color]: [...(product.color_images?.[color] ?? []), ...urls]
        }
      });
      setColorImageKey(color);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "图片上传失败");
    } finally {
      setUploadingColorImages(false);
    }
  }

  async function uploadSpecImage(files: FileList | null) {
    const file = files?.[0];
    const key = specImageKey.trim();

    if (!file || !key) {
      setUploadError("请先填写规格参数图片的参数名");
      return;
    }

    setUploadingSpecImage(true);
    setUploadError("");

    try {
      const url = await uploadFile(file);
      update({ ...product, specs: { ...product.specs, [key]: setSpecImageValue(product.specs[key], url) } });
      setSpecImageKey("");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "图片上传失败");
    } finally {
      setUploadingSpecImage(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <TextBlock label="产品名" value={product.name} onChange={(value) => update({ ...product, name: value, id: product.id || uid("prod", value) })} />
        <TextBlock
          label="Slug"
          value={product.slug}
          onChange={(value) => update({ ...product, slug: value })}
          helperText="建议使用小写英文、数字和横线，例如 underwater-treadmill-l800；不要留空格和中文。"
        />
        <label className={labelClass}>
          系列
          <select className={inputClass} value={product.line_slug} onChange={(event) => update({ ...product, line_slug: event.target.value as ProductRow["line_slug"] })}>
            {lineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <label className={labelClass}>
          一级大类目
          <select className={inputClass} value={category} onChange={(event) => updateCategory(event.target.value as ProductCategory)}>
            <option value="efoils">Hydrotherapy Equipment</option>
            <option value="foils">HydroSport Equipment</option>
          </select>
        </label>
        <label className={labelClass}>价格（美分）<NumberInput value={product.price_cents} onChange={(value) => update({ ...product, price_cents: value })} /></label>
        <label className={labelClass}>
          状态
          <select className={inputClass} value={product.status} onChange={(event) => update({ ...product, status: event.target.value as ProductRow["status"] })}>
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </select>
          <span className="text-xs font-normal text-slate-500">只有“发布”状态会在前台展示。</span>
        </label>
        <label className={labelClass}>排序<NumberInput value={product.sort_order} onChange={(value) => update({ ...product, sort_order: value })} /></label>
      </div>
      <div className="border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        热卖商品请统一在“Best Seller 设置”专区中维护。首页热卖区会按排序展示已选商品，最多展示 6 个。
      </div>
      <label className={labelClass}>产品摘要<textarea className={inputClass} rows={3} value={product.summary} onChange={(event) => update({ ...product, summary: event.target.value })} /></label>
      <label className={labelClass}>产品描述<textarea className={inputClass} rows={5} value={product.description} onChange={(event) => update({ ...product, description: event.target.value })} /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={labelClass}>
          产品图片
          <p className="text-xs font-normal leading-5 text-slate-500">建议图片尺寸：2000 x 2000px 方图，透明底 WebP/PNG 优先；列表和详情页会自动适配。</p>
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${buttonClass} cursor-pointer`}>
              <ImagePlus className="h-4 w-4" />
              {uploadingProductImages ? "上传中..." : "上传图片"}
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                multiple
                disabled={saving || uploadingProductImages}
                onChange={(event) => {
                  void uploadProductImages(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            <span className="text-xs text-slate-500">上传后会自动写入下方 URL 列表</span>
          </div>
          {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
          {product.images.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {product.images.map((image, index) => (
                <div key={`${image}-${index}`} className="overflow-hidden border border-slate-200 bg-white">
                  <Image src={image} alt="" width={240} height={160} unoptimized className="h-28 w-full object-contain bg-slate-50" />
                  <button
                    type="button"
                    className="w-full border-t border-slate-200 px-2 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                    onClick={() => update({ ...product, images: product.images.filter((_, itemIndex) => itemIndex !== index) })}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <textarea className={inputClass} rows={5} value={arrayToLines(product.images)} onChange={(event) => update({ ...product, images: linesToArray(event.target.value) })} />
        </div>
        <label className={labelClass}>颜色选项（每行一个）<textarea className={inputClass} rows={5} value={arrayToLines(product.color_options)} onChange={(event) => update({ ...product, color_options: linesToArray(event.target.value) })} /></label>
      </div>
      <div className={labelClass}>
        颜色图片
        <p className="text-xs font-normal leading-5 text-slate-500">先在颜色选项中填写颜色名，再选择对应颜色上传图片。建议图片尺寸：2000 x 2000px 方图，透明底 WebP/PNG 优先。</p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            className={inputClass}
            list="product-color-options"
            value={colorImageKey}
            onChange={(event) => setColorImageKey(event.target.value)}
            placeholder={product.color_options[0] ? `颜色名称，例如 ${product.color_options[0]}` : "颜色名称，例如 Blue"}
          />
          <datalist id="product-color-options">
            {product.color_options.map((color) => (
              <option key={color} value={color} />
            ))}
          </datalist>
          <label className={`${buttonClass} cursor-pointer justify-center`}>
            <ImagePlus className="h-4 w-4" />
            {uploadingColorImages ? "上传中..." : "上传颜色图片"}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              multiple
              disabled={saving || uploadingColorImages}
              onChange={(event) => {
                void uploadColorImages(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
        {Object.entries(product.color_images ?? {}).length ? (
          <div className="grid gap-4">
            {Object.entries(product.color_images ?? {}).map(([color, images]) => (
              <div key={color} className="border border-slate-200 bg-white p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-800">{color}</span>
                  <button
                    type="button"
                    className="text-xs text-slate-500 transition hover:text-red-600"
                    onClick={() => {
                      const next = { ...(product.color_images ?? {}) };
                      delete next[color];
                      update({ ...product, color_images: next });
                    }}
                  >
                    删除该颜色图片组
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                  {images.map((image, index) => (
                    <div key={`${color}-${image}-${index}`} className="overflow-hidden border border-slate-200 bg-white">
                      <Image src={image} alt="" width={180} height={120} unoptimized className="h-24 w-full bg-slate-50 object-contain" />
                      <button
                        type="button"
                        className="w-full border-t border-slate-200 px-2 py-2 text-xs text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                        onClick={() => {
                          const nextImages = images.filter((_, itemIndex) => itemIndex !== index);
                          const next = { ...(product.color_images ?? {}) };
                          if (nextImages.length) {
                            next[color] = nextImages;
                          } else {
                            delete next[color];
                          }
                          update({ ...product, color_images: next });
                        }}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className={labelClass}>
        详情卖点
        <p className="text-xs font-normal leading-5 text-slate-500">可输入文字，每行一个；也可上传图片。建议图片尺寸：1600 x 1000px 或 4:3 横图，WebP/JPG/PNG。</p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className={inputClass} value={detailText} onChange={(event) => setDetailText(event.target.value)} placeholder="输入一条文字卖点，例如 Quiet electric propulsion" />
          <button
            type="button"
            className={buttonClass}
            onClick={() => {
              const next = detailText.trim();
              if (!next) return;
              update({ ...product, details: [...product.details, next] });
              setDetailText("");
            }}
          >
            <Plus className="h-4 w-4" /> 添加文字
          </button>
          <label className={`${buttonClass} cursor-pointer`}>
            <ImagePlus className="h-4 w-4" />
            {uploadingDetailImages ? "上传中..." : "上传详情图片"}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              multiple
              disabled={saving || uploadingDetailImages}
              onChange={(event) => {
                void uploadDetailImages(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
        {product.details.length ? (
          <div className="grid gap-3">
            {product.details.map((detail, index) => (
              <div key={`${detail}-${index}`} className="flex items-start justify-between gap-3 border border-slate-200 bg-white p-3">
                {isImageValue(detail) ? (
                  <Image src={detail} alt="" width={220} height={140} unoptimized className="h-28 w-44 bg-slate-50 object-contain" />
                ) : (
                  <p className="text-sm leading-6 text-slate-700">{detail}</p>
                )}
                <button
                  type="button"
                  className="shrink-0 text-xs text-slate-500 transition hover:text-red-600"
                  onClick={() => update({ ...product, details: product.details.filter((_, itemIndex) => itemIndex !== index) })}
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <textarea className={inputClass} rows={5} value={arrayToLines(product.details)} onChange={(event) => update({ ...product, details: linesToArray(event.target.value) })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextBlock label="详情区眉标" value={product.detail_eyebrow} onChange={(value) => update({ ...product, detail_eyebrow: value })} />
        <TextBlock label="详情区标题" value={product.detail_title} onChange={(value) => update({ ...product, detail_title: value })} />
        <TextBlock label="对比区眉标" value={product.comparison_eyebrow} onChange={(value) => update({ ...product, comparison_eyebrow: value })} />
        <TextBlock label="对比区标题" value={product.comparison_title} onChange={(value) => update({ ...product, comparison_title: value })} />
      </div>
      <div className={labelClass}>
        规格参数（每行 key: value）
        <p className="text-xs font-normal leading-5 text-slate-500">可填写文字参数，也可上传参数图片。建议图片尺寸：1200 x 800px 或 3:2 横图，表格内会自动缩略展示。</p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className={inputClass} value={specImageKey} onChange={(event) => setSpecImageKey(event.target.value)} placeholder="图片参数名，例如 Battery Diagram" />
          <label className={`${buttonClass} cursor-pointer justify-center`}>
            <ImagePlus className="h-4 w-4" />
            {uploadingSpecImage ? "上传中..." : "上传参数图片"}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              disabled={saving || uploadingSpecImage}
              onChange={(event) => {
                void uploadSpecImage(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
        </div>
        {uploadError ? <p className="text-sm text-red-600">{uploadError}</p> : null}
        {Object.entries(product.specs ?? {}).length ? (
          <div className="grid gap-3">
            {Object.entries(product.specs ?? {}).map(([key, item]) => {
              const text = getSpecText(item);
              const image = getSpecImage(item);

              return (
                <div key={key} className="grid gap-3 border border-slate-200 bg-white p-3 md:grid-cols-[220px_1fr_auto]">
                  <div className="text-sm font-semibold text-slate-800">{key}</div>
                  <div className="grid gap-2 text-sm leading-6 text-slate-700">
                    {text ? <p>{text}</p> : null}
                    {image ? <Image src={image} alt="" width={260} height={160} unoptimized className="h-28 w-48 bg-slate-50 object-contain" /> : null}
                    {!text && !image ? <span className="text-slate-400">空参数</span> : null}
                  </div>
                  <button
                    type="button"
                    className="text-xs text-slate-500 transition hover:text-red-600"
                    onClick={() => {
                      const next = { ...product.specs };
                      delete next[key];
                      update({ ...product, specs: next });
                    }}
                  >
                    删除
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
        <textarea className={inputClass} rows={6} value={specsToText(product.specs)} onChange={(event) => update({ ...product, specs: textToSpecs(event.target.value, product.specs) })} />
      </div>
      <button type="button" disabled={saving} onClick={save} className={buttonClass}><Save className="h-4 w-4" /> 保存产品</button>
    </div>
  );
}
