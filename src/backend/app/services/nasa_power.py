"""Small server-side client for NASA POWER's public climate-normal API."""

from __future__ import annotations

from typing import Any

import requests

NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/climatology/point"
MONTH_KEYS = ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC")


class NASADataError(RuntimeError):
    """Raised when NASA POWER is unavailable or returns incomplete data."""


def fetch_monthly_normals(latitude: float, longitude: float) -> dict[str, Any]:
    """Fetch NASA POWER monthly temperature and rainfall normals for a point.

    POWER's public endpoint does not require the api.nasa.gov API key. Its
    climatology response describes long-term patterns, not a weather forecast.
    """
    try:
        response = requests.get(
            NASA_POWER_URL,
            params={
                "parameters": "T2M,PRECTOTCORR",
                "community": "AG",
                "longitude": longitude,
                "latitude": latitude,
                "format": "JSON",
            },
            timeout=20,
        )
        response.raise_for_status()
        payload = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise NASADataError("NASA POWER climate data is temporarily unavailable.") from exc

    if not isinstance(payload, dict):
        raise NASADataError("NASA POWER returned an invalid climate response.")

    parameters = payload.get("properties", {}).get("parameter", {})
    temperatures = parameters.get("T2M", {})
    precipitation = parameters.get("PRECTOTCORR", {})
    try:
        months = [
            {
                "month": index,
                "temperature_c": float(temperatures[key]),
                "precipitation_mm_per_day": float(precipitation[key]),
            }
            for index, key in enumerate(MONTH_KEYS, start=1)
        ]
        if any(value < -900 for item in months for value in item.values() if isinstance(value, float)):
            raise ValueError("NASA POWER returned a fill value")
        coordinates = payload["geometry"]["coordinates"]
        period = payload["header"]["range"]
    except (KeyError, TypeError, ValueError, IndexError) as exc:
        raise NASADataError("NASA POWER returned an incomplete climate record.") from exc

    return {
        "months": months,
        "grid_cell": {"latitude": float(coordinates[1]), "longitude": float(coordinates[0])},
        "period": str(period),
        "source": "NASA POWER · Agroclimatology",
    }

