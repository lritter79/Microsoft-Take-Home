import JsonInput from "./components/JsonInput/JsonInput";

const App = () => {
  const handleValidJson = (parsed: unknown) => {
    console.log("Valid parsed JSON:", parsed);
    // Proceed to pass it to a visualization component
  };

  return (
    <div>
      <h1>PostgreSQL EXPLAIN Visualizer</h1>
      <JsonInput onValidJson={handleValidJson} />
    </div>
  );
};

export default App;
