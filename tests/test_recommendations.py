from app.services.recommendations import make_farming_guidance, season_for_location


def normals_with_rain(values):
    return [
        {"month": index, "temperature_c": 20.0, "precipitation_mm_per_day": value}
        for index, value in enumerate(values, start=1)
    ]


def test_northern_hemisphere_season_uses_calendar_month():
    assert season_for_location(51.5, 4, normals_with_rain([1] * 12)) == "Spring"


def test_southern_hemisphere_season_is_reversed():
    assert season_for_location(-33.9, 1, normals_with_rain([1] * 12)) == "Summer"


def test_tropical_season_uses_local_rainfall_normal():
    normals = normals_with_rain([1, 1, 1, 8, 8, 8, 1, 1, 1, 1, 1, 1])
    assert season_for_location(-1.3, 4, normals) == "Wetter period"
    assert season_for_location(-1.3, 9, normals) == "Drier period"


def test_dry_hot_climate_guidance_explains_its_inputs():
    normals = normals_with_rain([1] * 12)
    guidance = make_farming_guidance(20, 5, 33.0, 1.2, normals)

    assert guidance["season"] == "Drier period"
    assert "mulch" in guidance["recommendation"]
    assert "heat-tolerant" in guidance["recommendation"]
    assert "33.00 °C" in guidance["rationale"]
    assert "1.20 mm/day" in guidance["rationale"]
