import pytest
import requests

from app.services.nasa_power import NASADataError, NASA_POWER_URL, fetch_monthly_normals


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def raise_for_status(self):
        return None

    def json(self):
        return self.payload


def sample_payload():
    keys = ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC")
    return {
        "geometry": {"coordinates": [-0.128, 51.507, 73.15]},
        "header": {"range": "January 2001 - December 2025"},
        "properties": {"parameter": {
            "T2M": {key: 10.0 for key in keys},
            "PRECTOTCORR": {key: 2.0 for key in keys},
        }},
    }


def test_fetch_normalizes_months_and_preserves_grid_metadata(monkeypatch):
    request = {}

    def fake_get(url, params, timeout):
        request.update(url=url, params=params, timeout=timeout)
        return FakeResponse(sample_payload())

    monkeypatch.setattr(requests, "get", fake_get)
    result = fetch_monthly_normals(51.5, -0.1)

    assert request["url"] == NASA_POWER_URL
    assert request["params"]["community"] == "AG"
    assert "api_key" not in request["params"]
    assert result["months"][0] == {
        "month": 1,
        "temperature_c": 10.0,
        "precipitation_mm_per_day": 2.0,
    }
    assert result["grid_cell"] == {"latitude": 51.507, "longitude": -0.128}
    assert result["period"] == "January 2001 - December 2025"


def test_fetch_rejects_nasa_fill_values(monkeypatch):
    payload = sample_payload()
    payload["properties"]["parameter"]["T2M"]["JAN"] = -999
    monkeypatch.setattr(requests, "get", lambda *args, **kwargs: FakeResponse(payload))

    with pytest.raises(NASADataError, match="incomplete climate record"):
        fetch_monthly_normals(51.5, -0.1)


def test_fetch_wraps_network_errors(monkeypatch):
    def fail_request(*args, **kwargs):
        raise requests.Timeout("upstream timeout")

    monkeypatch.setattr(requests, "get", fail_request)
    with pytest.raises(NASADataError, match="temporarily unavailable"):
        fetch_monthly_normals(51.5, -0.1)
