from __future__ import annotations

from datetime import date
from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas.climate import ClimateResponse
from app.services.nasa_power import NASADataError, fetch_monthly_normals
from app.services.recommendations import make_farming_guidance

router = APIRouter(prefix="/climate", tags=["climate"])


@router.get("", response_model=ClimateResponse, summary="Get a NASA POWER climate normal")
def get_climate(
    latitude: float = Query(ge=-90, le=90),
    longitude: float = Query(ge=-180, le=180),
    month: Optional[int] = Query(default=None, ge=1, le=12),
) -> ClimateResponse:
    """Return this month's climate normal and a transparent starter suggestion."""
    selected_month = month if month is not None else date.today().month
    try:
        climate = fetch_monthly_normals(latitude=latitude, longitude=longitude)
    except NASADataError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    month_values = climate["months"][selected_month - 1]
    guidance = make_farming_guidance(
        latitude=latitude,
        month=selected_month,
        temperature_c=month_values["temperature_c"],
        precipitation_mm_per_day=month_values["precipitation_mm_per_day"],
        monthly_normals=climate["months"],
    )

    return ClimateResponse(
        latitude=latitude,
        longitude=longitude,
        grid_cell=climate["grid_cell"],
        month=selected_month,
        month_name=date(2000, selected_month, 1).strftime("%B"),
        season=guidance["season"],
        temperature_c=month_values["temperature_c"],
        precipitation_mm_per_day=month_values["precipitation_mm_per_day"],
        recommendation=guidance["recommendation"],
        rationale=guidance["rationale"],
        source=climate["source"],
        period=climate["period"],
    )
