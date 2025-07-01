import React, { useState } from "react";
import styles from "./JsonInput.module.css";
import type { PlanHead } from "../../types/planNode";
import { validateExplainJson } from "../../utils/validateExplainJson";

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
    const parsed = JSON.parse(input);
    const result = validateExplainJson(parsed);

    if (result.isValid) {
      setError(null);
      onValidJson(result.data);
    } else {
      setError(result.error);
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
