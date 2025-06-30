import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomMode/CustomNode";

const nodeTypes = {
  tooltip: CustomNode,
};

const Visualizer: React.FC<{
  nodes: Node[];
  edges: Edge[];
}> = ({ nodes, edges }) => {
  return (
    <div style={{ height: "75vh", backgroundColor: "white" }}>
      <ReactFlow
        nodes={nodes}
        colorMode="dark"
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>{" "}
    </div>
  );
};

export default Visualizer;
