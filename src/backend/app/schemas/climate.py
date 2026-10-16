from pydantic import BaseModel, ConfigDict, Field


class GridCell(BaseModel):
    latitude: float
    longitude: float


class ClimateResponse(BaseModel):
    """A single month's long-term climate normal and its source context."""

    model_config = ConfigDict(json_schema_extra={"examples": [{
        "latitude": 51.5072,
        "longitude": -0.1276,
        "grid_cell": {"latitude": 51.507, "longitude": -0.128},
        "month": 10,
        "month_name": "October",
        "season": "Autumn",
        "temperature_c": 11.29,
        "precipitation_mm_per_day": 2.37,
        "recommendation": "The monthly normal is moderate; monitor soil moisture and time sowing around dependable rainfall.",
        "rationale": "NASA POWER's October normal is 11.29 °C and 2.37 mm/day of precipitation.",
        "source": "NASA POWER · Agroclimatology",
        "period": "25-year Meteorological and Solar Monthly & Annual Climatologies (January 2001 - December 2025)",
    }]})

    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    grid_cell: GridCell
    month: int = Field(ge=1, le=12)
    month_name: str
    season: str
    temperature_c: float
    precipitation_mm_per_day: float
    recommendation: str
    rationale: str
    source: str = "NASA POWER · Agroclimatology"
    period: str
