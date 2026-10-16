"""Simple, explainable seasonal guidance based on climate normals."""

from __future__ import annotations

from statistics import median
from typing import Any


def season_for_location(latitude: float, month: int, monthly_normals: list[dict[str, Any]]) -> str:
    """Return a calendar season outside the tropics or a rainfall period within."""
    if abs(latitude) < 23.5:
        monthly_rain = [item["precipitation_mm_per_day"] for item in monthly_normals]
        current_rain = monthly_rain[month - 1]
        return "Wetter period" if current_rain > median(monthly_rain) else "Drier period"

    northern_month = month if latitude > 0 else ((month + 5) % 12) + 1
    if northern_month in (12, 1, 2):
        return "Winter"
    if northern_month in (3, 4, 5):
        return "Spring"
    if northern_month in (6, 7, 8):
        return "Summer"
    return "Autumn"


def make_farming_guidance(
    latitude: float,
    month: int,
    temperature_c: float,
    precipitation_mm_per_day: float,
    monthly_normals: list[dict[str, Any]],
) -> dict[str, str]:
    """Build conservative starter advice and state which climate values drive it."""
    season = season_for_location(latitude, month, monthly_normals)

    if precipitation_mm_per_day < 2:
        water_advice = "The monthly normal is dry; conserve soil moisture with mulch and plan supplemental irrigation only if water is available."
    elif precipitation_mm_per_day >= 5:
        water_advice = "The monthly normal is wet; check drainage and avoid working saturated soil to reduce waterlogging and erosion."
    else:
        water_advice = "The monthly normal is moderate; monitor soil moisture and time sowing around dependable rainfall."

    if temperature_c >= 30:
        temperature_advice = "Favor heat-tolerant varieties and protect young plants from heat stress."
    elif temperature_c < 10:
        temperature_advice = "Favor cool-season crops and check local frost dates before planting sensitive seedlings."
    else:
        temperature_advice = f"Use the local {season.lower()} crop calendar to time planting and field work."

    return {
        "season": season,
        "recommendation": f"{water_advice} {temperature_advice}",
        "rationale": (
            f"NASA POWER's monthly normal for month {month} is {temperature_c:.2f} °C "
            f"and {precipitation_mm_per_day:.2f} mm/day of precipitation."
        ),
    }

