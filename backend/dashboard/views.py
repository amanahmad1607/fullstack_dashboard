from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import requests

WB_API = "https://api.worldbank.org/v2"

def wb_timeseries(country, indicator, start, end):
    url = f"{WB_API}/country/{country}/indicator/{indicator}?date={start}:{end}&format=json"
    r = requests.get(url, timeout=20)
    data = r.json()
    # data[1] contains array with 'date' (year) and 'value'
    series = []
    if isinstance(data, list) and len(data) > 1 and isinstance(data[1], list):
        for row in data[1]:
            year = row.get("date")
            value = row.get("value")
            if year is not None:
                series.append({"year": int(year), "value": value})
    series = sorted(series, key=lambda d: d["year"])
    return series

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def line_series(request):
    country = request.GET.get("country", "IND")
    indicator = request.GET.get("indicator", "SP.POP.TOTL")  # total population
    start = request.GET.get("start", "2019")
    end = request.GET.get("end", "2024")
    series = wb_timeseries(country, indicator, start, end)
    return Response({"country": country, "indicator": indicator, "series": series})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kpis(request):
    # Build KPIs using a few indicators
    country = request.GET.get("country", "IND")
    start = request.GET.get("start", "2019")
    end = request.GET.get("end", "2024")
    # Use population and GDP to craft KPI-like numbers
    pop = wb_timeseries(country, "SP.POP.TOTL", start, end)
    gdp = wb_timeseries(country, "NY.GDP.MKTP.CD", start, end)
    last_pop = (pop[-1]["value"] if pop else None) or 0
    last_gdp = (gdp[-1]["value"] if gdp else None) or 0

    # Fake "accuracy" and "response time" derived for demo purposes
    accuracy = 87.5
    avg_response = 2.3
    active_participants = int((last_pop or 0) % 1000) + 300  # just a stable pseudo
    total_polls = int((last_gdp or 0) % 5000) + 1000

    return Response({
        "total_polls": {"value": total_polls, "delta": 12},
        "accuracy_rate": {"value": accuracy, "delta": 5.2},
        "active_participants": {"value": active_participants, "delta": 18},
        "avg_response_time": {"value": avg_response, "delta": -0.5},
        "meta": {"country": country, "start": start, "end": end},
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def bar_indicators(request):
    country = request.GET.get("country", "IND")
    year = request.GET.get("year", "2022")
    indicators = {
        "GDP (USD)": "NY.GDP.MKTP.CD",
        "CO2 Emissions (kt)": "EN.ATM.CO2E.KT",
        "Internet Users (%)": "IT.NET.USER.ZS",
        "Renewable Energy (%)": "EG.FEC.RNEW.ZS",
        "Life Expectancy": "SP.DYN.LE00.IN",
    }
    bars = []
    for label, code in indicators.items():
        series = wb_timeseries(country, code, year, year)
        val = series[-1]["value"] if series else None
        bars.append({"label": label, "value": val})
    return Response({"country": country, "year": int(year), "bars": bars})
