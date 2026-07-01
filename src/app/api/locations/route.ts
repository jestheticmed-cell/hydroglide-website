import { City, Country, State } from "country-state-city";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isIsoCode(value: string) {
  return /^[A-Z0-9-]{1,10}$/i.test(value);
}

export function GET(request: NextRequest) {
  const countryCode = request.nextUrl.searchParams.get("country")?.toUpperCase() ?? "";
  const stateCode = request.nextUrl.searchParams.get("state")?.toUpperCase() ?? "";

  if (!countryCode) {
    const countries = Country.getAllCountries()
      .map((country) => ({
        isoCode: country.isoCode,
        name: country.name
      }))
      .sort((left, right) => left.name.localeCompare(right.name));

    return NextResponse.json({ countries });
  }

  if (!isIsoCode(countryCode) || (stateCode && !isIsoCode(stateCode))) {
    return NextResponse.json({ error: "Invalid location code." }, { status: 400 });
  }

  if (stateCode) {
    const cities = City.getCitiesOfState(countryCode, stateCode)
      .map((city) => ({ name: city.name }))
      .sort((left, right) => left.name.localeCompare(right.name));

    return NextResponse.json({ cities });
  }

  const states = State.getStatesOfCountry(countryCode)
    .map((state) => ({
      isoCode: state.isoCode,
      name: state.name
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  const cities = states.length
    ? []
    : (City.getCitiesOfCountry(countryCode) ?? [])
        .map((city) => ({ name: city.name }))
        .sort((left, right) => left.name.localeCompare(right.name));

  return NextResponse.json({ states, cities });
}
