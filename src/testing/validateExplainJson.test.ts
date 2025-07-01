import { describe, it, expect } from "vitest";
import { validateExplainJson } from "../utils/validateExplainJson";

describe("validateExplainJson", () => {
  it("rejects non-array input", () => {
    const input = { Plan: {} };
    const result = validateExplainJson(input);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toMatch(/not an array/i);
    }
  });

  it("rejects empty array", () => {
    const result = validateExplainJson([]);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toMatch(/empty array/i);
    }
  });

  it("rejects array with multiple elements", () => {
    const input = [{ Plan: {} }, { Plan: {} }];
    const result = validateExplainJson(input);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toMatch(/multiple objects/i);
    }
  });

  it("rejects object without Plan key", () => {
    const input = [{ "Execution Time": 5 }];
    const result = validateExplainJson(input);
    expect(result.isValid).toBe(false);
    if (!result.isValid) {
      expect(result.error).toMatch(/'Plan' key/i);
    }
  });

  it("accepts valid EXPLAIN ANALYZE JSON", () => {
    const input = [
      {
        Plan: {
          "Node Type": "Seq Scan",
          "Relation Name": "users",
        },
        "Planning Time": 0.123,
        "Execution Time": 1.456,
        Triggers: [],
      },
    ];

    const result = validateExplainJson(input);
    expect(result.isValid).toBe(true);
    if (result.isValid) {
      expect(result.data.Plan["Node Type"]).toBe("Seq Scan");
    }
  });
});
