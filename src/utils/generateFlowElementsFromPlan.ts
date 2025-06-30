import type { IPlanNode } from "../types/planNode";
import { type Node, type Edge, Position } from "@xyflow/react";

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
    offsetX: number,
    isFirstChild: boolean
  ): { id: string; width: number; centerX: number } {
    const currentId = `node-${nodeCounter++}`;
    const { Plans, ...nodeData } = node;
    const y = depth * LEVEL_HEIGHT;

    let subtreeWidth = 0;
    const childCenters: number[] = [];
    const childIds: string[] = [];

    if (Plans && Plans.length > 0) {
      let childOffsetX = offsetX;

      for (let i = 0; i <= Plans.length - 1; i++) {
        const child = Plans[i];
        const {
          id: childId,
          width: childWidth,
          centerX: childCenterX,
        } = traverse(
          child,
          depth + 1,
          childOffsetX,
          (isFirstChild = i === 0)
        );
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
      type: "tooltip", // Assuming 'tooltip' is the custom node type
      data: {
        label: node["Node Type"],
        position: isFirstChild ? Position.Right : Position.Left, // Position based on whether it's the first child
        stats: {
          ...nodeData,
        },
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

  traverse(plan, 0, 0, true);

  return { nodes, edges };
}
