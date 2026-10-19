"""
CivicIntel AI City Benchmark Matching Engine.

Implements multi-dimensional weighted similarity matching between developing target cities
and candidate benchmark cities using scikit-learn, normalized feature distances,
Gower/Jaccard categorical measures, and explicit development maturity separation.
"""

from copy import deepcopy
import math
from typing import Any, Dict, List, Optional, Set, Tuple
import numpy as np


# Default weights from CivicIntel Research Paper
DEFAULT_CATEGORY_WEIGHTS: Dict[str, float] = {
    "geography_terrain": 0.15,
    "climate": 0.10,
    "population": 0.10,
    "economic_structure": 0.15,
    "natural_resources": 0.15,
    "education_human_dev": 0.15,
    "infrastructure_healthcare": 0.10,
    "tourism_cultural": 0.10,
}

# Category Feature Definitions
CATEGORY_FEATURES: Dict[str, Dict[str, Any]] = {
    "geography_terrain": {
        "label": "Geography & Terrain",
        "numerical": ["elevation_m", "forest_cover_pct"],
        "categorical": ["terrain_type"],
        "multi_label": [],
    },
    "climate": {
        "label": "Climate & Environment",
        "numerical": ["annual_rainfall_mm", "summer_max_temp_c"],
        "categorical": ["climate_zone"],
        "multi_label": [],
    },
    "population": {
        "label": "Population Characteristics",
        "numerical": ["population", "urbanization_pct", "tribal_demographic_pct"],
        "categorical": [],
        "multi_label": [],
    },
    "economic_structure": {
        "label": "Economic Structure",
        "numerical": ["formal_employment_pct", "per_capita_income_inr"],
        "categorical": ["primary_economic_pillar"],
        "multi_label": [],
    },
    "natural_resources": {
        "label": "Natural Resources",
        "numerical": ["soil_fertility_index", "water_abundance_index"],
        "categorical": [],
        "multi_label": ["natural_resources"],
    },
    "education_human_dev": {
        "label": "Education & Human Development",
        "numerical": ["literacy_rate", "higher_edu_institutes_count"],
        "categorical": [],
        "multi_label": [],
    },
    "infrastructure_healthcare": {
        "label": "Infrastructure & Healthcare",
        "numerical": [
            "doctor_ratio_per_10k",
            "hospital_bed_ratio_per_1k",
            "paved_road_pct",
            "piped_water_pct",
            "broadband_pct",
        ],
        "categorical": [],
        "multi_label": [],
    },
    "tourism_cultural": {
        "label": "Tourism & Cultural Profile",
        "numerical": ["eco_tourism_potential", "annual_tourist_footfall"],
        "categorical": ["cultural_heritage_type"],
        "multi_label": [],
    },
}

# Feature Validation Constraints (min, max, allow_none)
FEATURE_CONSTRAINTS: Dict[str, Tuple[Optional[float], Optional[float]]] = {
    "elevation_m": (-500.0, 9000.0),
    "forest_cover_pct": (0.0, 100.0),
    "annual_rainfall_mm": (0.0, 15000.0),
    "summer_max_temp_c": (-30.0, 60.0),
    "population": (0.0, 50000000.0),
    "urbanization_pct": (0.0, 100.0),
    "tribal_demographic_pct": (0.0, 100.0),
    "formal_employment_pct": (0.0, 100.0),
    "per_capita_income_inr": (0.0, 5000000.0),
    "soil_fertility_index": (0.0, 100.0),
    "water_abundance_index": (0.0, 100.0),
    "literacy_rate": (0.0, 100.0),
    "higher_edu_institutes_count": (0.0, 1000.0),
    "doctor_ratio_per_10k": (0.0, 200.0),
    "hospital_bed_ratio_per_1k": (0.0, 50.0),
    "paved_road_pct": (0.0, 100.0),
    "piped_water_pct": (0.0, 100.0),
    "broadband_pct": (0.0, 100.0),
    "eco_tourism_potential": (0.0, 10.0),
    "annual_tourist_footfall": (0.0, 50000000.0),
    "development_maturity_score": (0.0, 100.0),
}


class CityBenchmarkMatcher:
    """
    Core AI City Benchmark Matching Engine.
    
    Implements:
    - Multi-dimensional data validation & sanitization
    - Median-based missing feature imputation with explicit warnings
    - Range-safe min-max numerical normalization
    - Categorical & multi-label Jaccard distance calculation
    - Weighted feature distance: D(A,B) = sum(w_j * d_j(A,B))
    - Similarity score: S(A,B) = 1 / (1 + D(A,B))
    - Separate development maturity analysis and aspirational filtering
    - Feature contribution breakdown and automated natural-language explanation
    """

    def __init__(
        self,
        custom_weights: Optional[Dict[str, float]] = None,
        candidate_pool: Optional[List[Dict[str, Any]]] = None,
    ):
        self.weights = self._normalize_weights(custom_weights or DEFAULT_CATEGORY_WEIGHTS)
        self.candidate_pool = candidate_pool or []

    @staticmethod
    def _normalize_weights(weights: Dict[str, float]) -> Dict[str, float]:
        """Validates and normalizes weights so they sum to 1.0."""
        cleaned_weights: Dict[str, float] = {}
        for category in DEFAULT_CATEGORY_WEIGHTS.keys():
            val = weights.get(category, DEFAULT_CATEGORY_WEIGHTS[category])
            if val < 0:
                raise ValueError(f"Weight for category '{category}' cannot be negative: {val}")
            cleaned_weights[category] = float(val)

        total = sum(cleaned_weights.values())
        if total <= 0:
            raise ValueError("Sum of category weights must be greater than zero.")

        return {k: v / total for k, v in cleaned_weights.items()}

    def validate_city_profile(self, city: Dict[str, Any], is_target: bool = False) -> List[str]:
        """
        Validates city dictionary against required identifiers and numerical constraints.
        Returns a list of warnings or raises ValueError on critical invalid data.
        """
        warnings: List[str] = []

        if not isinstance(city, dict):
            raise ValueError("City profile must be a dictionary.")

        city_id = city.get("id")
        city_name = city.get("name")
        if not city_id or not isinstance(city_id, str):
            raise ValueError("City profile is missing a valid 'id' string identifier.")
        if not city_name or not isinstance(city_name, str):
            raise ValueError(f"City '{city_id}' is missing a valid 'name' string.")

        # Check numeric constraints
        for feature, (min_val, max_val) in FEATURE_CONSTRAINTS.items():
            val = city.get(feature)
            if val is not None:
                try:
                    num_val = float(val)
                    if math.isnan(num_val) or math.isinf(num_val):
                        raise ValueError(f"Invalid non-finite number for '{feature}' in city '{city_id}': {val}")
                    if min_val is not None and num_val < min_val:
                        raise ValueError(
                            f"Value for '{feature}' ({num_val}) in city '{city_id}' is below minimum allowed ({min_val})."
                        )
                    if max_val is not None and num_val > max_val:
                        raise ValueError(
                            f"Value for '{feature}' ({num_val}) in city '{city_id}' exceeds maximum allowed ({max_val})."
                        )
                except (TypeError, ValueError) as e:
                    if "below minimum allowed" in str(e) or "exceeds maximum allowed" in str(e):
                        raise
                    raise ValueError(f"Feature '{feature}' in city '{city_id}' must be numeric: {val}")

        return warnings

    def _impute_and_prepare_dataset(
        self, target: Dict[str, Any], candidates: List[Dict[str, Any]]
    ) -> Tuple[Dict[str, Any], List[Dict[str, Any]], Dict[str, List[str]]]:
        """
        Validates, deduplicates, and imputes missing features across target and candidates.
        Returns: (prepared_target, prepared_candidates, city_warnings_map)
        """
        warnings_map: Dict[str, List[str]] = {}

        # 1. Validate target
        target_copy = deepcopy(target)
        warnings_map[target_copy["id"]] = self.validate_city_profile(target_copy, is_target=True)

        # 2. Validate and deduplicate candidates (and exclude target if present in candidates)
        seen_ids: Set[str] = {target_copy["id"]}
        prepared_candidates: List[Dict[str, Any]] = []

        for candidate in candidates:
            c_copy = deepcopy(candidate)
            self.validate_city_profile(c_copy, is_target=False)
            c_id = c_copy["id"]
            if c_id in seen_ids:
                # Deduplicate or skip target city itself
                continue
            seen_ids.add(c_id)
            warnings_map[c_id] = []
            prepared_candidates.append(c_copy)

        if not prepared_candidates:
            raise ValueError("Candidate pool is empty or contains only the target city.")

        # 3. Compute medians for numerical features across all valid entries for imputation
        all_cities = [target_copy] + prepared_candidates
        numerical_medians: Dict[str, float] = {}

        for feature in FEATURE_CONSTRAINTS.keys():
            valid_values = [
                float(c[feature])
                for c in all_cities
                if feature in c and c[feature] is not None
            ]
            if valid_values:
                numerical_medians[feature] = float(np.median(valid_values))
            else:
                numerical_medians[feature] = 0.0

        # 4. Impute missing values with explicit warnings
        for city in all_cities:
            c_id = city["id"]
            # Check numerical
            for feature in FEATURE_CONSTRAINTS.keys():
                if feature not in city or city[feature] is None:
                    imputed_val = numerical_medians[feature]
                    city[feature] = imputed_val
                    warnings_map[c_id].append(
                        f"Imputed missing numerical feature '{feature}' with dataset median ({imputed_val:.2f})."
                    )

            # Check categorical
            for cat_group in CATEGORY_FEATURES.values():
                for cat_feat in cat_group["categorical"]:
                    if cat_feat not in city or not city[cat_feat]:
                        city[cat_feat] = "unspecified"
                        warnings_map[c_id].append(
                            f"Missing categorical feature '{cat_feat}' set to 'unspecified'."
                        )
                for multi_feat in cat_group["multi_label"]:
                    if multi_feat not in city or city[multi_feat] is None:
                        city[multi_feat] = []
                        warnings_map[c_id].append(
                            f"Missing multi-label feature '{multi_feat}' set to empty list."
                        )

        return target_copy, prepared_candidates, warnings_map

    def _calculate_feature_scales(
        self, all_cities: List[Dict[str, Any]]
    ) -> Dict[str, Tuple[float, float]]:
        """
        Computes min and max values for all numerical features across the active dataset.
        Prevents division-by-zero using a fallback range if min == max.
        """
        scales: Dict[str, Tuple[float, float]] = {}
        for feature in FEATURE_CONSTRAINTS.keys():
            vals = [float(c[feature]) for c in all_cities]
            min_v = float(np.min(vals))
            max_v = float(np.max(vals))
            scales[feature] = (min_v, max_v)
        return scales

    def match_city(
        self,
        target_city: Dict[str, Any],
        candidate_pool: Optional[List[Dict[str, Any]]] = None,
        top_k: int = 5,
        min_maturity_delta: Optional[float] = None,
        aspirational_only: bool = False,
        sort_by: str = "similarity",  # 'similarity', 'maturity_delta', or 'benchmark_fit'
    ) -> Dict[str, Any]:
        """
        Executes multi-dimensional matching between target city and candidates.
        
        Args:
            target_city: City profile to benchmark.
            candidate_pool: Optional override pool of candidate benchmark cities.
            top_k: Number of benchmark candidates to return (default: 5).
            min_maturity_delta: Minimum maturity score difference required (e.g., 0.0 or +5.0).
            aspirational_only: If True, only returns cities with maturity >= target city maturity.
            sort_by: Ranking strategy ('similarity', 'maturity_delta', or 'benchmark_fit').
            
        Returns:
            Dict containing methodology, weights, target summary, and top candidates with evidence.
        """
        pool = candidate_pool if candidate_pool is not None else self.candidate_pool
        target, candidates, warnings_map = self._impute_and_prepare_dataset(target_city, pool)

        all_cities = [target] + candidates
        scales = self._calculate_feature_scales(all_cities)

        target_maturity = float(target.get("development_maturity_score", 50.0))
        evaluated_candidates: List[Dict[str, Any]] = []

        for candidate in candidates:
            c_id = candidate["id"]
            cand_maturity = float(candidate.get("development_maturity_score", 50.0))
            maturity_delta = round(cand_maturity - target_maturity, 2)

            # Maturity filtering
            if aspirational_only and maturity_delta < 0:
                continue
            if min_maturity_delta is not None and maturity_delta < min_maturity_delta:
                continue

            # Calculate Category-Level Distances
            category_comparisons: Dict[str, Dict[str, Any]] = {}
            total_weighted_distance = 0.0

            for cat_key, cat_meta in CATEGORY_FEATURES.items():
                cat_weight = self.weights[cat_key]
                feature_distances: List[float] = []
                feature_details: Dict[str, Dict[str, Any]] = {}

                # 1. Numerical Features
                for num_feat in cat_meta["numerical"]:
                    t_val = float(target[num_feat])
                    c_val = float(candidate[num_feat])
                    min_val, max_val = scales[num_feat]
                    val_range = max_val - min_val

                    # Normalized Distance in [0, 1]
                    if val_range > 1e-9:
                        norm_dist = abs(t_val - c_val) / val_range
                    else:
                        norm_dist = 0.0 if t_val == c_val else 1.0

                    feature_distances.append(norm_dist)
                    feature_details[num_feat] = {
                        "target": t_val,
                        "candidate": c_val,
                        "normalized_distance": round(norm_dist, 4),
                        "similarity_pct": round((1.0 - norm_dist) * 100, 1),
                    }

                # 2. Categorical Features (Exact match / Gower distance)
                for cat_feat in cat_meta["categorical"]:
                    t_cat = str(target[cat_feat]).strip().lower()
                    c_cat = str(candidate[cat_feat]).strip().lower()
                    cat_dist = 0.0 if t_cat == c_cat else 1.0
                    feature_distances.append(cat_dist)
                    feature_details[cat_feat] = {
                        "target": target[cat_feat],
                        "candidate": candidate[cat_feat],
                        "match": t_cat == c_cat,
                        "normalized_distance": cat_dist,
                        "similarity_pct": 100.0 if t_cat == c_cat else 0.0,
                    }

                # 3. Multi-label Features (Jaccard Distance)
                for multi_feat in cat_meta["multi_label"]:
                    t_set = set(target[multi_feat]) if isinstance(target[multi_feat], (list, set)) else set()
                    c_set = set(candidate[multi_feat]) if isinstance(candidate[multi_feat], (list, set)) else set()
                    union_len = len(t_set.union(c_set))
                    if union_len == 0:
                        jaccard_sim = 1.0
                    else:
                        jaccard_sim = len(t_set.intersection(c_set)) / union_len

                    jaccard_dist = 1.0 - jaccard_sim
                    feature_distances.append(jaccard_dist)
                    feature_details[multi_feat] = {
                        "target": sorted(list(t_set)),
                        "candidate": sorted(list(c_set)),
                        "shared": sorted(list(t_set.intersection(c_set))),
                        "jaccard_similarity": round(jaccard_sim, 4),
                        "normalized_distance": round(jaccard_dist, 4),
                        "similarity_pct": round(jaccard_sim * 100, 1),
                    }

                # Average category distance
                cat_distance = float(np.mean(feature_distances)) if feature_distances else 0.0
                weighted_cat_distance = cat_weight * cat_distance
                total_weighted_distance += weighted_cat_distance

                category_comparisons[cat_key] = {
                    "category": cat_key,
                    "label": cat_meta["label"],
                    "weight": round(cat_weight, 3),
                    "normalized_distance": round(cat_distance, 4),
                    "similarity_pct": round((1.0 - cat_distance) * 100, 2),
                    "weighted_contribution": round(weighted_cat_distance, 4),
                    "features": feature_details,
                }

            # Formula from paper: S(A, B) = 1 / (1 + D(A, B))
            similarity_score = 1.0 / (1.0 + total_weighted_distance)
            similarity_pct = round(similarity_score * 100, 2)

            # Maturity Category
            if maturity_delta >= 15.0:
                maturity_tier = "Aspirational Leap Benchmark"
            elif maturity_delta >= 5.0:
                maturity_tier = "Progressive Growth Benchmark"
            elif maturity_delta >= -5.0:
                maturity_tier = "Lateral Contextual Peer"
            else:
                maturity_tier = "Developing Peer"

            # Composite Benchmark Fit Score:
            # 65% Contextual Similarity + 35% Normalized Maturity Progression
            # Normalizing maturity delta: +25 delta maps to 1.0, 0 maps to 0.5, -25 maps to 0.0
            norm_maturity_factor = max(0.0, min(1.0, (maturity_delta + 25.0) / 50.0))
            benchmark_fit_score = (0.65 * similarity_score) + (0.35 * norm_maturity_factor)

            # Generate Evidence-Based Explanation
            explanation = self._generate_explanation(
                target=target,
                candidate=candidate,
                category_comparisons=category_comparisons,
                similarity_score=similarity_score,
                maturity_delta=maturity_delta,
                maturity_tier=maturity_tier,
            )

            # Merge warnings
            cand_warnings = list(warnings_map.get(c_id, []))
            if warnings_map.get(target["id"]):
                cand_warnings.extend([f"Target Warning: {w}" for w in warnings_map[target["id"]]])

            evaluated_candidates.append({
                "candidate_city": {
                    "id": candidate["id"],
                    "name": candidate["name"],
                    "state": candidate.get("state", "Unknown"),
                    "category": candidate.get("category", "General"),
                },
                "similarity_score": round(similarity_score, 4),
                "similarity_pct": similarity_pct,
                "weighted_distance": round(total_weighted_distance, 4),
                "benchmark_fit_score": round(benchmark_fit_score, 4),
                "development_maturity": {
                    "candidate_score": cand_maturity,
                    "target_score": target_maturity,
                    "maturity_delta": maturity_delta,
                    "maturity_tier": maturity_tier,
                },
                "category_comparisons": category_comparisons,
                "supporting_data_sources": candidate.get("data_sources", ["CivicIntel Multi-Domain Registry"]),
                "missing_data_warnings": cand_warnings,
                "explanation": explanation,
            })

        # Sorting strategy
        if sort_by == "maturity_delta":
            evaluated_candidates.sort(
                key=lambda x: (x["development_maturity"]["maturity_delta"], x["similarity_score"]),
                reverse=True,
            )
        elif sort_by == "benchmark_fit":
            evaluated_candidates.sort(
                key=lambda x: (x["benchmark_fit_score"], x["similarity_score"]),
                reverse=True,
            )
        else:  # default 'similarity'
            evaluated_candidates.sort(
                key=lambda x: (x["similarity_score"], x["development_maturity"]["maturity_delta"]),
                reverse=True,
            )

        top_candidates = evaluated_candidates[:top_k]

        return {
            "target_city": {
                "id": target["id"],
                "name": target["name"],
                "state": target.get("state", "Unknown"),
                "category": target.get("category", "Target"),
                "development_maturity_score": target_maturity,
            },
            "methodology": {
                "formula": "S(A,B) = 1 / (1 + D(A,B))",
                "distance_metric": "D(A,B) = sum(w_j * d_j(A,B))",
                "normalization": "Min-Max feature scaling bounded in [0, 1]",
                "categorical_encoding": "Gower exact matching & Jaccard multi-label set distance",
                "maturity_handling": "Separated development maturity index with aspirational benchmark filtering",
                "active_weights": {k: round(v, 4) for k, v in self.weights.items()},
                "sort_criterion": sort_by,
            },
            "total_candidates_evaluated": len(candidates),
            "candidates_returned_count": len(top_candidates),
            "top_candidates": top_candidates,
        }

    def _generate_explanation(
        self,
        target: Dict[str, Any],
        candidate: Dict[str, Any],
        category_comparisons: Dict[str, Dict[str, Any]],
        similarity_score: float,
        maturity_delta: float,
        maturity_tier: str,
    ) -> str:
        """
        Synthesizes an analytical, evidence-based justification for why this candidate
        was matched with the target city and how planners should leverage the benchmark.
        """
        # Find top 2 most congruent categories (highest similarity)
        sorted_categories = sorted(
            category_comparisons.values(),
            key=lambda x: x["similarity_pct"],
            reverse=True,
        )
        top_cats = sorted_categories[:2]
        cat_names = [c["label"] for c in top_cats]

        # Shared natural resources
        t_res = set(target.get("natural_resources", []))
        c_res = set(candidate.get("natural_resources", []))
        shared_res = list(t_res.intersection(c_res))

        # Build narrative
        reasons: List[str] = []

        # Terrain & climate context
        t_terrain = target.get("terrain_type", "").replace("_", " ")
        c_terrain = candidate.get("terrain_type", "").replace("_", " ")
        if t_terrain == c_terrain:
            reasons.append(f"shares identical {t_terrain} topography and highland agro-climatic conditions")
        else:
            reasons.append(f"exhibits compatible geographic characteristics ({c_terrain} vs {t_terrain})")

        # Resources
        if shared_res:
            res_str = ", ".join(shared_res[:3])
            reasons.append(f"common economic and natural resource endowments ({res_str})")

        # Top category synergy
        reasons.append(f"highest congruence across {cat_names[0]} ({top_cats[0]['similarity_pct']}%) and {cat_names[1]} ({top_cats[1]['similarity_pct']}%)")

        core_synergy = "; ".join(reasons)

        # Maturity outcome
        if maturity_delta > 5.0:
            maturity_narrative = (
                f"As a {maturity_tier} with a +{maturity_delta:.1f} pt development maturity advantage "
                f"({candidate.get('development_maturity_score', 0):.1f} vs {target.get('development_maturity_score', 0):.1f}), "
                f"{candidate['name']} provides a validated policy roadmap for {target['name']} to advance "
                f"formal employment ({candidate.get('formal_employment_pct', 0):.1f}% vs {target.get('formal_employment_pct', 0):.1f}%) "
                f"and literacy ({candidate.get('literacy_rate', 0):.1f}% vs {target.get('literacy_rate', 0):.1f}%) "
                f"while preserving ecological integrity."
            )
        elif maturity_delta >= -5.0:
            maturity_narrative = (
                f"Positioned as a {maturity_tier} (Δ {maturity_delta:+.1f} pts), {candidate['name']} serves as "
                f"a direct operational peer for cross-district learning and mutual capacity benchmarking."
            )
        else:
            maturity_narrative = (
                f"Classified as a {maturity_tier} (Δ {maturity_delta:+.1f} pts), {candidate['name']} offers "
                f"comparative insights into shared baseline challenges in infrastructure and human capital."
            )

        return (
            f"{candidate['name']} ({candidate.get('state', '')}) was selected because it {core_synergy}. "
            f"{maturity_narrative}"
        )
