# How to run this React App

Simply paste the following commands into your terminal to start the React app and open it in your browser:

```
npm install && npm run dev
```

# Design Decisions

I decided to use a tree structure visualization because I thought it best encapsulated the structure of the query plan. I did a search for existing libraries to use for the tree diagram, and found React Flow from a Reddit thread. I used it because it had the best documentation, and the most polished look and UX out of the box. Next, I gave each operation node a toolbar for displaying the specific data on it, and a tooltip for each metric with a description of what it means in context.

# Process

Before coding, I read the PostgreSQL docs, and watched some videos about the PostgreSQL EXPLAIN ANALYZE command. Then I brainstormed what a user might want to get out of a query plan visualizer.
I started out by just using the Vite CLI to scaffold the React project. Next, I used ChatGPT to write some base components, validation logic, and the algorithm for extracting nodes and edges from a query plan. I also used it to write a webscraper to scrape the pgmustard site for explanations for each metric and operation. I followed along with the React Flow docs to create the custom nodes and toolbars. I also used Copilot for writing documentation and TS types, as well as making minor revisions and autocorrection while coding.

# ChatGPT Prompt Examples

```
Create a simple UI in react with a text area to paste in a string and a button to submit the string in the text area for validation. Ask me 5 clarifying questions before writing the components
```

```
Make a simple tooltip react component that takes in a string as a parameter and shows a circled question mark that shows the string on hover. Ask me 5 clarifying questions before coding it out.
```

```
consider the following TS objects: "  const nodes = [
    {
      id: "1",
      data: { label: "Hello" },
      position: { x: 0, y: 0 },
      type: "input",
    },
    {
      id: "2",
      data: { label: "World" },
      position: { x: -100, y: 100 },
    },
    {
      id: "3",
      data: { label: "World" },
      position: { x: -250, y: 200 },
    },
    {
      id: "4",
      data: { label: "World" },
      position: { x: -100, y: 200 },
    },
  ];

  const edges = [
    { id: "1-2", source: "1", target: "2" },
    { id: "2-3", source: "2", target: "3" },
    { id: "2-4", source: "2", target: "4" },
  ];"

Now consider the following json for a SQL EXPLAIN ANALYZE plan: "[
  {
    "Plan": {
      "Node Type": "Sort",
      "Parallel Aware": false,
      "Async Capable": false,
      "Startup Cost": 32.11,
      "Total Cost": 32.82,
      "Plan Rows": 283,
      "Plan Width": 68,
      "Actual Startup Time": 0.037,
      "Actual Total Time": 0.041,
      "Actual Rows": 2,
      "Actual Loops": 1,
      "Sort Key": ["dept", "name"],
      "Sort Method": "quicksort",
      "Sort Space Used": 25,
      "Sort Space Type": "Memory",
      "Plans": [
        {
          "Node Type": "Bitmap Heap Scan",
          "Parent Relationship": "Outer",
          "Parallel Aware": false,
          "Async Capable": false,
          "Relation Name": "employee",
          "Alias": "employee",
          "Startup Cost": 6.34,
          "Total Cost": 20.59,
          "Plan Rows": 283,
          "Plan Width": 68,
          "Actual Startup Time": 0.008,
          "Actual Total Time": 0.011,
          "Actual Rows": 2,
          "Actual Loops": 1,
          "Recheck Cond": "(empid > 1)",
          "Rows Removed by Index Recheck": 0,
          "Filter": "(name ~~ '%a%'::text)",
          "Rows Removed by Filter": 0,
          "Exact Heap Blocks": 1,
          "Lossy Heap Blocks": 0,
          "Plans": [
            {
              "Node Type": "Bitmap Index Scan",
              "Parent Relationship": "Outer",
              "Parallel Aware": false,
              "Async Capable": false,
              "Index Name": "employee_pkey",
              "Startup Cost": 0.0,
              "Total Cost": 6.27,
              "Plan Rows": 283,
              "Plan Width": 0,
              "Actual Startup Time": 0.002,
              "Actual Total Time": 0.003,
              "Actual Rows": 2,
              "Actual Loops": 1,
              "Index Cond": "(empid > 1)"
            }
          ]
        }
      ]
    },
    "Planning Time": 0.997,
    "Triggers": [],
    "Execution Time": 0.064
  }
]" Write a function that takes the plan and its child nodes and returns edges and nodes similar to the ts objects from before. ask me 5 questions before writing the fxn"
```

```
"Write a component that takes in an array of the following b=object and displays the data by the keys in a logical way: "/
export type Trigger = {
  "Trigger Name": string;
  Relation: string;
  Time: number;
  Calls: number;
};"
```

```
I need help writing a webscraper for scraping information from this website: https://www.pgmustard.com/docs/explain

The goal of the webscraper is to gather all the operations that could happen behind the scnes when a SQL query is ran, and get the descriptions of fields on the operation as returned by the EXPLAIN command

On pgMustard's site, those are the docs with a glossary for the "EXPLAIN" SQL command. On that page there are 3 h3 tags with a phrase like "{word{s} operations" and then below the h3, a ul with links to pages describing that operation, or just non clickable text. On each page with an operation, there's an h3 tag with the phrase "{given operation} fields" and undee that a UL with each field as a link. On clickinkg the link, there's a page where hte feld name is a h1 and the text is below it. I've attached photos of these different pages.

What I would like the scraper to do is iterate through each operation, take that operations fields and the description of the field and return it as a TS Record<string, string> type where the key is the field name and the value is the field description. There should not be duplicate keys. Ask me 5 questions before coding the scraper
```

```
Consider the following React component: "import React, { useState } from "react";
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
      } else {
        throw new Error(
          "Parsed JSON is not an array, please ensure it is in the correct format (which should just be the output of EXPLAIN ANALYZE (FORMAT JSON) in Postgres)."
        );
      }
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

export default JsonInput;"

Revise it to have the validation logic in a separate function, and write some tests for the validation fxn. Ask me 5 clarifying questions before you code it out
```
