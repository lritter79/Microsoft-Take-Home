import React, { useState } from "react";
import styles from "./JsonInput.module.css";
import type { PlanHead } from "../../types/planNode";

interface JsonInputProps {
  onValidJson: (parsedJson: PlanHead) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onValidJson }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
    if (error) setError(null); // Clear error as soon as user changes input
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          throw new Error("Parsed JSON is an empty array");
        } else if (parsed.length > 1) {
          throw new Error(
            "Parsed JSON contains multiple objects. Please provide a single EXPLAIN ANALYZE output."
          );
        }

        if (
          parsed[0] &&
          parsed[0] instanceof Object &&
          "Plan" in parsed[0]
        ) {
          setError(null);
          onValidJson(parsed[0] as PlanHead);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const errorMessage =
        err && typeof err === "object" && "message" in err
          ? (err as Error).message
          : "Invalid JSON: Please ensure the input is valid JSON format.";
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        value={input}
        onChange={handleChange}
        placeholder="Paste your EXPLAIN ANALYZE (FORMAT JSON) output here..."
      />
      <button className={styles.button} onClick={handleSubmit}>
        Submit
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default JsonInput;
