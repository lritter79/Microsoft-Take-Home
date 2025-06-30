import { describe, it, expect } from "vitest";
import { generateFlowElementsFromPlan } from "../utils/generateFlowElementsFromPlan";

import type { IPlanNode } from "../types/planNode";
import type { Operation } from "../types/operation";

const mockPlan: IPlanNode = {
  "Node Type": "Sort" as Operation,
  Plans: [
    {
      "Node Type": "Seq Scan" as Operation,
      Plans: [
        {
          "Node Type": "Index Scan" as Operation,
        },
      ],
    },
    {
      "Node Type": "Bitmap Heap Scan" as Operation,
      Plans: [
        {
          "Node Type": "Bitmap Index Scan" as Operation,
        },
      ],
    },
  ],
};

describe("generateFlowElementsFromPlan", () => {
  it("generates correct number of nodes and edges", () => {
    const { nodes, edges } = generateFlowElementsFromPlan(mockPlan);
    expect(nodes).toHaveLength(5); // Sort, Seq Scan, Index Scan, Bitmap Heap, Bitmap Index
    expect(edges).toHaveLength(4); // 2 from Sort, 1 from Seq, 1 from Bitmap Heap
  });

  it("spaces nodes vertically", () => {
    const { nodes } = generateFlowElementsFromPlan(mockPlan);
    const getNode = (label: string) =>
      nodes.find((n) => n.data.label === label)!;

    const sortY = getNode("Sort").position.y;
    const seqY = getNode("Seq Scan").position.y;

    expect(seqY).toBeGreaterThan(sortY);
  });

  it("connects nodes via correct edges", () => {
    const { edges } = generateFlowElementsFromPlan(mockPlan);

    const edgeStrs = edges.map((e) => `${e.source}->${e.target}`);
    expect(edgeStrs).toContain("node-0->node-1"); // Sort → Seq Scan
    expect(edgeStrs).toContain("node-1->node-2"); // Seq Scan → Index Scan
    expect(edgeStrs).toContain("node-0->node-3"); // Sort → Bitmap Heap
    expect(edgeStrs).toContain("node-3->node-4"); // Bitmap Heap → Bitmap Index
  });

  it("centers parent node x above its children", () => {
    const { nodes } = generateFlowElementsFromPlan(mockPlan);
    const sort = nodes.find((n) => n.data.label === "Sort")!;
    const left = nodes.find((n) => n.data.label === "Seq Scan")!;
    const right = nodes.find(
      (n) => n.data.label === "Bitmap Heap Scan"
    )!;

    expect(sort.position.x).toBeGreaterThan(left.position.x);
    expect(sort.position.x).toBeLessThan(right.position.x);
  });
});
