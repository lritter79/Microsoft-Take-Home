import { useState } from "react";
import JsonInput from "./components/JsonInput/JsonInput";
import type { PlanHead } from "./types/planNode";

const App = () => {
  const [queryPlan, setQueryPlan] = useState<PlanHead | null>(null);
  const handleValidJson = (parsed: PlanHead) => {
    console.log("Valid parsed JSON:", parsed);
    // Proceed to pass it to a visualization component
    setQueryPlan(parsed);
  };

  return (
    <div>
      <h1>PostgreSQL EXPLAIN Visualizer</h1>
      <JsonInput onValidJson={handleValidJson} />
      {JSON.stringify(queryPlan, null, 2) && (
        <div>
          <h2>Parsed Query Plan</h2>
          <pre>{JSON.stringify(queryPlan, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
