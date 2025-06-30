import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const Visualizer: React.FC<{
  nodes: Node[];
  edges: Edge[];
}> = ({ nodes, edges }) => {
  return (
    <div style={{ height: "50%", backgroundColor: "white" }}>
      <ReactFlow nodes={nodes} colorMode="dark" edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>{" "}
    </div>
  );
};

export default Visualizer;
