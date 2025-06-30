import {
  Background,
  Controls,
  ReactFlow,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode/CustomNode";

const nodeTypes = {
  tooltip: CustomNode,
};

const Visualizer: React.FC<{
  nodes: Node[];
  edges: Edge[];
}> = ({ nodes, edges }) => {
  const [flowNodes, , onNodesChange] = useNodesState(nodes);

  return (
    <div style={{ height: "75vh", backgroundColor: "white" }}>
      <ReactFlow
        nodes={flowNodes}
        onNodesChange={onNodesChange}
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
