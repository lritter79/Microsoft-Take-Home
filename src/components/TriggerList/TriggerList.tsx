import React from "react";
import styles from "./TriggerList.module.css";
import type { Trigger } from "../../types/planNode";

type TriggerListProps = {
  triggers: Trigger[];
};

const TriggerList: React.FC<TriggerListProps> = ({ triggers }) => {
  if (triggers.length === 0) {
    return;
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Trigger Name</th>
          <th>Relation</th>
          <th>Time (ms)</th>
          <th>Calls</th>
        </tr>
      </thead>
      <tbody>
        {triggers.map((trigger, index) => (
          <tr key={`${trigger["Trigger Name"]}-${index}`}>
            <td>{trigger["Trigger Name"]}</td>
            <td>{trigger.Relation}</td>
            <td>{trigger.Time.toFixed(2)}</td>
            <td>{trigger.Calls}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TriggerList;
