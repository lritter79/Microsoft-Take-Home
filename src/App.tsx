import { useState } from "react";
import JsonInput from "./components/JsonInput/JsonInput";
import type { PlanHead } from "./types/planNode";
import Visualizer from "./components/Visualizer/Visualizer";
import { generateFlowElementsFromPlan } from "./utils/generateFlowElementsFromPlan";
import type { Edge, Node } from "@xyflow/react";

const App = () => {
  const [queryPlan, setQueryPlan] = useState<PlanHead | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const handleValidJson = (parsed: PlanHead) => {
    console.log("Valid parsed JSON:", parsed);
    // Proceed to pass it to a visualization component
    const plansAsNodesAndEdges = generateFlowElementsFromPlan(
      parsed.Plan
    );
    console.log("Generated nodes:", plansAsNodesAndEdges.nodes);
    console.log("Generated edges:", plansAsNodesAndEdges.edges);
    setQueryPlan(parsed);
    setNodes(plansAsNodesAndEdges.nodes);
    setEdges(plansAsNodesAndEdges.edges);
  };

  return (
    <div style={{ height: "100vh" }}>
      <h1>PostgreSQL EXPLAIN Visualizer</h1>
      <JsonInput onValidJson={handleValidJson} />
      {queryPlan && (
        <>
          <h2>Query Plan</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            Planning Time: {queryPlan["Planning Time"]} ms
            <br />
            Execution Time: {queryPlan["Execution Time"]} ms
          </pre>
        </>
      )}
      {nodes.length > 0 && (
        <>
          <h2>Query Plan Visualization</h2>{" "}
          <Visualizer nodes={nodes} edges={edges} />
        </>
      )}
    </div>
  );
};

export default App;
