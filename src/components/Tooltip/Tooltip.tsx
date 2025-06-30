import React from "react";
import styles from "./Tooltip.module.css";

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className={styles.tooltipContainer}>
      <span className={styles.questionMark}>?</span>
      <div className={styles.tooltipText}>{text}</div>
    </div>
  );
};

export default Tooltip;
