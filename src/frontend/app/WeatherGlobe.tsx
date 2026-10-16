"use client";

import { useEffect, useMemo, useState } from "react";

const locations = [
  { name: "London", country: "United Kingdom", latitude: 51.5072, longitude: -0.1276 },
  { name: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219 },
  { name: "São Paulo", country: "Brazil", latitude: -23.5505, longitude: -46.6333 },
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.006 },
  { name: "Reykjavík", country: "Iceland", latitude: 64.1466, longitude: -21.9426 },
  { name: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { name: "Mumbai", country: "India", latitude: 19.076, longitude: 72.8777 },
  { name: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { name: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
  { name: "Vancouver", country: "Canada", latitude: 49.2827, longitude: -123.1207 },
];

type ClimateMonth = { month: number; temperatureC: number; precipitationMmPerDay: number };
type Climate = {
  latitude: number;
  longitude: number;
  period: string;
  gridCell: { latitude: number; longitude: number };
  source: string;
  units: { temperature: string; precipitation: string };
  months: ClimateMonth[];
};

function currentSeason(latitude: number, month: number, rainfall: number, months: ClimateMonth[]) {
  if (Math.abs(latitude) < 23.5) {
    const middle = [...months].sort((a, b) => a.precipitationMmPerDay - b.precipitationMmPerDay)[5]?.precipitationMmPerDay ?? rainfall;
    return rainfall > middle ? "Wetter period" : "Drier period";
  }
  const north = latitude > 0;
  const seasonMonth = north ? month : ((month + 5) % 12) + 1;
  if ([12, 1, 2].includes(seasonMonth)) return "Winter";
  if ([3, 4, 5].includes(seasonMonth)) return "Spring";
  if ([6, 7, 8].includes(seasonMonth)) return "Summer";
  return "Autumn";
}

function farmingGuidance(temperature: number, rainfall: number, season: string) {
  const waterAdvice = rainfall < 2
    ? "The normal is very dry; conserve soil moisture with mulch and plan any supplemental irrigation carefully."
    : rainfall >= 5
      ? "The normal is wet; check drainage and avoid working saturated soil to reduce waterlogging and erosion."
      : "The normal is moderate; monitor soil moisture and time sowing around dependable rainfall.";
  const temperatureAdvice = temperature >= 30
    ? "Prefer heat-tolerant varieties and protect young plants from heat stress."
    : temperature < 10
      ? "Favor cool-season crops and check local frost dates before planting sensitive seedlings."
      : `Use the local ${season.toLowerCase()} crop calendar to time planting and field work.`;
  return `${waterAdvice} ${temperatureAdvice}`;
}

export default function WeatherGlobe() {
  const [selectedName, setSelectedName] = useState("London");
  const [rotation, setRotation] = useState(0);
  const [climate, setClimate] = useState<Climate | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [reloads, setReloads] = useState(0);
  const selected = locations.find((place) => place.name === selectedName) ?? locations[0];

  useEffect(() => {
    const controller = new AbortController();
    async function loadClimate() {
      setBusy(true);
      setError("");
      setClimate(null);
      try {
        const query = new URLSearchParams({ latitude: String(selected.latitude), longitude: String(selected.longitude) });
        const response = await fetch(`/api/climate?${query}`, { signal: controller.signal, cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? "NASA climate data is unavailable.");
        setClimate(data as Climate);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load climate data.");
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }
    void loadClimate();
    return () => controller.abort();
  }, [selected, reloads]);

  const points = useMemo(() => locations.map((place) => {
    const lat = (place.latitude * Math.PI) / 180;
    const lon = ((place.longitude + rotation) * Math.PI) / 180;
    const x = Math.cos(lat) * Math.sin(lon);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);
    return { ...place, x: 210 + x * 174, y: 210 - y * 174, visible: z > -0.08 };
  }), [rotation]);

  const now = new Date();
  const monthNumber = now.getMonth() + 1;
  const climateMonth = climate?.months.find((item) => item.month === monthNumber);
  const season = climateMonth && climate ? currentSeason(selected.latitude, monthNumber, climateMonth.precipitationMmPerDay, climate.months) : "";
  const advice = climateMonth && season ? farmingGuidance(climateMonth.temperatureC, climateMonth.precipitationMmPerDay, season) : "";

  return (
    <section className="globe-section" id="live-weather">
      <div className="shell globe-shell">
        <div className="globe-heading">
          <div><div className="eyebrow dark-eyebrow">NASA CLIMATE, LOCAL CONTEXT</div><h2>Know the season.<br /><em>Plan the field.</em></h2></div>
          <p>Explore long-term monthly climate patterns for sample locations. Select a marker to see this month’s climate normal and a practical starting point for farm planning.</p>
        </div>
        <div className="globe-dashboard">
          <div className="globe-stage">
            <div className="globe-tag"><span className="live-dot" /> NASA POWER CLIMATE NORMALS <span>·</span> 10 SAMPLE PLACES</div>
            <svg className="globe-svg" viewBox="0 0 420 420" role="img" aria-label="Rotatable globe with selectable sample locations">
              <defs>
                <radialGradient id="ocean" cx="34%" cy="28%"><stop offset="0" stopColor="#57816e"/><stop offset="1" stopColor="#183f35"/></radialGradient>
                <clipPath id="sphere"><circle cx="210" cy="210" r="174"/></clipPath>
              </defs>
              <circle cx="210" cy="210" r="179" fill="#c6d1a7" opacity=".28" />
              <circle cx="210" cy="210" r="174" fill="url(#ocean)" />
              <g clipPath="url(#sphere)" fill="none" stroke="#c9d9bc" strokeOpacity=".19" strokeWidth="1">
                <ellipse cx="210" cy="210" rx="174" ry="52"/><ellipse cx="210" cy="210" rx="174" ry="112"/>
                <ellipse cx="210" cy="210" rx="63" ry="174"/><ellipse cx="210" cy="210" rx="122" ry="174"/>
                <path d="M36 210h348M53 142h314M53 278h314" />
              </g>
              <g clipPath="url(#sphere)" fill="#b8c99a" opacity=".86">
                <path d="m67 103 18-20 33-9 21 9 11 17-8 13 9 17-13 18-7 27-17 11-11-12-21-4-7-18-16-14 1-19-11-11 8-13Z" />
                <path d="m133 196 23 7 18 21 3 26-12 20-4 25-15 26-9-20-4-29-14-22 4-26-12-17Z" />
                <path d="m193 96 20-12 24 7 14 18-8 12-25 2-14 13-20-12-9-17Z" />
                <path d="m210 146 24-10 26 9 14 20-9 20-14 10-5 34-18 25-9 34-15 22-13-22 2-33-11-21 8-30-11-25 5-22Z" />
                <path d="m260 103 25-17 39 5 25 20-3 23-18 13-5 21-19 5-11-12-18 6-16-16-20-9 4-21Z" />
                <path d="m319 254 27-11 23 13 5 21-14 17-31-4-18-17Z" />
              </g>
              {points.filter((point) => point.visible).map((point) => (
                <g key={point.name} className="globe-marker" onClick={() => setSelectedName(point.name)} role="button" tabIndex={0} aria-label={`View NASA climate normals for ${point.name}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedName(point.name); }}>
                  <circle cx={point.x} cy={point.y} r={selected.name === point.name ? 8 : 6} fill={selected.name === point.name ? "#f4d77e" : "#d8e7a8"} stroke="#173d32" strokeWidth="2" />
                  {selected.name === point.name && <text x={point.x + 11} y={point.y - 8} fill="#f6f4e9" fontSize="10" fontWeight="600">{point.name}</text>}
                </g>
              ))}
            </svg>
            <div className="globe-controls"><button onClick={() => setRotation((value) => value - 35)} aria-label="Rotate globe left">←</button><button onClick={() => setRotation((value) => value + 35)} aria-label="Rotate globe right">→</button></div>
            <div className="globe-footnote">SELECT A MARKER · ROTATE TO EXPLORE</div>
          </div>
          <aside className="weather-detail climate-detail" aria-live="polite">
            <div className="detail-overline">SEASONAL FIELD NOTE</div>
            <div className="detail-city">{selected.name}<span>{selected.country}</span></div>
            {busy ? <div className="detail-loading">Loading NASA climate normals…</div> : error ? <div className="detail-error">{error}<button onClick={() => setReloads((value) => value + 1)}>Try again</button></div> : climateMonth && climate ? <>
              <div className="detail-condition">{new Intl.DateTimeFormat("en", { month: "long" }).format(now)} · {season}</div>
              <div className="climate-metrics"><div><span>MONTHLY MEAN TEMP.</span><b>{climateMonth.temperatureC.toFixed(1)}<small> °C</small></b></div><div><span>MEAN DAILY RAINFALL</span><b>{climateMonth.precipitationMmPerDay.toFixed(1)}<small> mm/day</small></b></div></div>
              <div className="recommendation"><div>FARMING SUGGESTION</div><p>{advice}</p><small>Climate signal: {climateMonth.temperatureC.toFixed(1)} °C mean temperature and {climateMonth.precipitationMmPerDay.toFixed(1)} mm/day mean precipitation for this month.</small></div>
              <div className="detail-source">NASA POWER · AGROCLIMATOLOGY<br />Monthly climatology · {climate.period}<br />Grid cell: {climate.gridCell.latitude.toFixed(2)}°, {climate.gridCell.longitude.toFixed(2)}°</div>
            </> : <div className="detail-error">No climate data available for this location.<button onClick={() => setReloads((value) => value + 1)}>Try again</button></div>}
          </aside>
        </div>
        <div className="globe-attribution">NASA POWER climate data. Suggestions are general, climate-based guidance; local soils, crop choice, and farm conditions matter.</div>
      </div>
    </section>
  );
}
