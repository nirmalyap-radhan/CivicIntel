from typing import Dict, List, Tuple


def calculate_sector_score(indicators: List[dict]) -> float:
    """Calculates a normalized score (0-100) for a set of indicators within a sector."""
    if not indicators:
        return 50.0

    scores = []
    for ind in indicators:
        val = ind.get("value", 0.0)
        unit = ind.get("unit", "")
        # Normalize based on typical indicator metrics
        if "%" in unit:
            score = max(0.0, min(100.0, val))
        elif "10k" in unit:  # doctor density: 25 is ideal tier-1 metro baseline
            score = max(0.0, min(100.0, (val / 25.0) * 100.0))
        elif "1,000" in unit:  # hospital beds: 4 per 1k is target
            score = max(0.0, min(100.0, (val / 4.0) * 100.0))
        else:
            score = max(0.0, min(100.0, val))
        scores.append(score)

    return round(sum(scores) / len(scores), 2)


def compute_gap_and_runway(
    target_value: float,
    benchmark_value: float,
    annual_growth_rate: float = 0.05
) -> Tuple[float, float, str]:
    """
    Computes percentage gap, estimated runway in years to achieve parity,
    and priority level.
    """
    if benchmark_value == 0:
        return 0.0, 0.0, "Low"

    gap_pct = round(((target_value - benchmark_value) / benchmark_value) * 100.0, 2)

    # Runway in years based on compounding catch-up formula
    if gap_pct >= 0:
        runway_years = 0.0
        priority = "Low"
    else:
        abs_gap = abs(gap_pct)
        # Catch-up runway approximation
        runway_years = round(abs_gap / (annual_growth_rate * 100.0 * 2.2), 1)
        runway_years = max(1.0, min(10.0, runway_years))

        if abs_gap > 50:
            priority = "Critical"
        elif abs_gap > 25:
            priority = "High"
        else:
            priority = "Medium"

    return gap_pct, runway_years, priority
