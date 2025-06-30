import type { IPlanNode } from "../types/planNode";
import type { Node, Edge } from "@xyflow/react";

export function generateFlowElementsFromPlan(plan: IPlanNode) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let nodeCounter = 0;
  const LEAF_WIDTH = 150;
  const LEVEL_HEIGHT = 100;

  /**
   * Recursively traverses the plan tree, assigning position and collecting nodes/edges.
   * Returns the node's ID and its subtree width.
   */
  function traverse(
    node: IPlanNode,
    depth: number,
    offsetX: number
  ): { id: string; width: number; centerX: number } {
    const currentId = `node-${nodeCounter++}`;
    const { Plans, ...nodeData } = node;
    const y = depth * LEVEL_HEIGHT;

    let subtreeWidth = 0;
    const childCenters: number[] = [];
    const childIds: string[] = [];

    if (Plans && Plans.length > 0) {
      let childOffsetX = offsetX;
      for (const child of Plans) {
        const {
          id: childId,
          width: childWidth,
          centerX: childCenterX,
        } = traverse(child, depth + 1, childOffsetX);
        subtreeWidth += childWidth;
        childCenters.push(childCenterX);
        childIds.push(childId);
        childOffsetX += childWidth;
      }
    } else {
      subtreeWidth = LEAF_WIDTH;
      childCenters.push(offsetX + LEAF_WIDTH / 2);
    }

    const centerX =
      childCenters.length > 0
        ? childCenters.reduce((sum, cx) => sum + cx, 0) /
          childCenters.length
        : offsetX + LEAF_WIDTH / 2;

    // Add the current node
    nodes.push({
      id: currentId,
      data: {
        label: node["Node Type"],
        ...nodeData,
      },
      position: {
        x: centerX,
        y,
      },
    });

    // Add edges to children
    for (const childId of childIds) {
      edges.push({
        id: `${currentId}-${childId}`,
        source: currentId,
        target: childId,
      });
    }

    return { id: currentId, width: subtreeWidth, centerX };
  }

  traverse(plan, 0, 0);

  return { nodes, edges };
}
