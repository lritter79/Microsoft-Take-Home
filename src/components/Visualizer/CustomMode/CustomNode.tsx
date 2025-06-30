/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import { Handle, Position, NodeToolbar } from "@xyflow/react";
import styles from "./CustomNode.module.css";

type CustomNodeData = {
  label: string;
  // Add the correct type for position if needed, e.g.:

  stats: Record<string, string | number>;
};

const CustomNode = ({ data }: { data: CustomNodeData }) => {
  console.log("CustomNode data:", data);
  const [showToolbar, setShowToolbar] = useState(false);
  return (
    <>
      {showToolbar && (
        <NodeToolbar
          isVisible={showToolbar}
          position={Position.Bottom}
        >
          {Object.entries(data.stats).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value.toString()}
            </div>
          ))}
        </NodeToolbar>
      )}

      <div
        style={{ padding: "10px 20px" }}
        className={styles.node}
        onBlur={() => setShowToolbar(false)}
      >
        <label>{data.stats["Node Type"]}</label>
        <button onClick={() => setShowToolbar(!showToolbar)}></button>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(CustomNode);
