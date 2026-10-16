import { NextResponse } from "next/server";

const monthKeys = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

type ParameterValues = Record<string, number | string | null>;
type PowerResponse = {
  geometry?: { coordinates?: number[] };
  properties?: { parameter?: Record<string, ParameterValues> };
  header?: { range?: string };
};

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const latitude = Number(search.get("latitude"));
  const longitude = Number(search.get("longitude"));

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
      !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Choose a valid latitude and longitude." }, { status: 400 });
  }

  const params = new URLSearchParams({
    parameters: "T2M,PRECTOTCORR",
    community: "AG",
    longitude: longitude.toFixed(4),
    latitude: latitude.toFixed(4),
    format: "JSON",
  });

  try {
    const response = await fetch(`https://power.larc.nasa.gov/api/temporal/climatology/point?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!response.ok) {
      return NextResponse.json({ error: "NASA POWER could not return climate data for this location." }, { status: 502 });
    }
    const power = (await response.json()) as PowerResponse;
    const parameters = power.properties?.parameter;
    const temperatures = parameters?.T2M;
    const precipitation = parameters?.PRECTOTCORR;

    if (!temperatures || !precipitation) {
      return NextResponse.json({ error: "NASA POWER returned an incomplete climate record." }, { status: 502 });
    }

    const months = monthKeys.map((month, index) => ({
      month: index + 1,
      temperatureC: Number(temperatures[month]),
      precipitationMmPerDay: Number(precipitation[month]),
    })).filter((month) => Number.isFinite(month.temperatureC) && Number.isFinite(month.precipitationMmPerDay));

    if (months.length !== 12) {
      return NextResponse.json({ error: "NASA POWER returned an incomplete monthly climate record." }, { status: 502 });
    }

    return NextResponse.json({
      latitude,
      longitude,
      period: power.header?.range ?? "NASA POWER pre-computed monthly climatology",
      gridCell: power.geometry?.coordinates
        ? { latitude: power.geometry.coordinates[1], longitude: power.geometry.coordinates[0] }
        : { latitude, longitude },
      source: "NASA POWER · Agroclimatology",
      units: { temperature: "°C", precipitation: "mm/day (monthly mean daily rate)" },
      months,
    });
  } catch {
    return NextResponse.json({ error: "Could not connect to NASA POWER. Please try again shortly." }, { status: 502 });
  }
}
