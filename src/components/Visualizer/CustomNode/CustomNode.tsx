/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useState } from "react";
import { Handle, Position, NodeToolbar } from "@xyflow/react";
import styles from "./CustomNode.module.css";
import { pgMustardFields } from "../../../constants/pgmustard_fields";
import type { Operation } from "../../../types/operation";
import Tooltip from "../../Tooltip/Tooltip";

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
          style={{
            border: "1px solid #eee",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 1000,
            padding: "5px",
            borderRadius: "5px",
            background: "white",
            color: "black",
          }}
          isVisible={showToolbar}
          position={Position.Bottom}
        >
          {Object.entries(data.stats).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong>
              {value.toString()} {key}
              {data.stats["Node Type"] in pgMustardFields &&
                (pgMustardFields[
                  data.stats["Node Type"] as Operation
                ][key] ? (
                  <Tooltip
                    text={
                      pgMustardFields[
                        data.stats["Node Type"] as Operation
                      ][key]
                    }
                  />
                ) : null)}{" "}
            </div>
          ))}
        </NodeToolbar>
      )}

      <NodeToolbar style={{ padding: "10px 20px" }}>
        {Object.entries(data.stats).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong>
            {value.toString()}{" "}
            {data.stats["Node Type"] in pgMustardFields &&
              (pgMustardFields[data.stats["Node Type"] as Operation][
                key
              ] ? (
                <Tooltip
                  text={
                    pgMustardFields[
                      data.stats["Node Type"] as Operation
                    ][key]
                  }
                />
              ) : null)}{" "}
          </div>
        ))}
      </NodeToolbar>

      <NodeToolbar
        style={{ padding: "10px 20px" }}
        className={styles.node}
        onBlur={() => setShowToolbar(false)}
      >
        <label>{data.stats["Node Type"]}</label>
        <button onClick={() => setShowToolbar(!showToolbar)}></button>
      </NodeToolbar>

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
