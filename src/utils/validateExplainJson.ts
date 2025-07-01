import type { PlanHead } from "../types/planNode";

type PositveValidationResult = {
  isValid: true;
  data: PlanHead;
};

type NegativeResultFalse = {
  isValid: false;
  error: string;
};

type ValidationResult =
  | PositveValidationResult
  | NegativeResultFalse;

/**
 * Validates parsed JSON to ensure it matches Postgres EXPLAIN ANALYZE (FORMAT JSON) output.
 */
export function validateExplainJson(
  parsed: unknown
): ValidationResult {
  if (!Array.isArray(parsed)) {
    return {
      isValid: false,
      error:
        "Parsed JSON is not an array. Please provide the output of EXPLAIN ANALYZE (FORMAT JSON).",
    };
  }

  if (parsed.length === 0) {
    return {
      isValid: false,
      error: "Parsed JSON is an empty array.",
    };
  }

  if (parsed.length > 1) {
    return {
      isValid: false,
      error:
        "Parsed JSON contains multiple objects. Please provide a single EXPLAIN ANALYZE output.",
    };
  }

  const head = parsed[0];
  if (
    typeof head !== "object" ||
    head === null ||
    !("Plan" in head)
  ) {
    return {
      isValid: false,
      error:
        "Invalid structure. Expected a top-level object with a 'Plan' key.",
    };
  }

  return {
    isValid: true,
    data: head as PlanHead,
  };
}
