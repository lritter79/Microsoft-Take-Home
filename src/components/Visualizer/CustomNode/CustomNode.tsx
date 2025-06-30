import { memo } from "react";
import { Handle, Position, NodeToolbar } from "@xyflow/react";
import styles from "./CustomNode.module.css";
import { pgMustardFields } from "../../../constants/pgmustard_fields";
import type { Operation } from "../../../types/operation";
import Tooltip from "../Tooltip/Tooltip";
import { pgMustardOperationDescriptions } from "../../../constants/pgmustard_operation_descriptions";

type CustomNodeData = {
  label: string;
  stats: Record<string, string | number>;
};

const CustomNode = ({
  data,
  selected,
}: {
  data: CustomNodeData;
  selected: boolean;
}) => {
  const fields =
    pgMustardFields[data.stats["Node Type"] as Operation] || {};
  return (
    <>
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
        position={Position.Bottom}
      >
        {Object.entries(data.stats).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong>
            {value.toString()}{" "}
            {key === "Node Type" && (
              <>
                {value in pgMustardOperationDescriptions && (
                  <Tooltip
                    text={
                      pgMustardOperationDescriptions[
                        data.stats["Node Type"] as Operation
                      ]
                    }
                  />
                )}
              </>
            )}
            {key !== "Node Type" && (
              <>
                {fields[key] ? <Tooltip text={fields[key]} /> : null}
              </>
            )}{" "}
          </div>
        ))}
      </NodeToolbar>

      <div
        style={{ padding: "10px 20px" }}
        className={`${styles.node} ${
          selected ? styles.selected : ""
        }`}
      >
        <a>{data.stats["Node Type"]}</a>
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(CustomNode);
