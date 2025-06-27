import React, { useState } from 'react';
import styles from './JsonInput.module.css';

interface JsonInputProps {
  onValidJson: (parsedJson: unknown) => void;
}

const JsonInput: React.FC<JsonInputProps> = ({ onValidJson }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (error) setError(null); // Clear error as soon as user changes input
  };

  const handleSubmit = () => {
    try {
      const parsed = JSON.parse(input);
      setError(null);
      onValidJson(parsed);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Invalid JSON: Please ensure the input is valid JSON format.');
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
