import type { Operation } from "./operation";

/**
 * This type represents a trigger in a PostgreSQL query plan.
 * A trigger is an event that occurs in the database, such as a row being inserted,
 * updated, or deleted. It includes the name of the trigger, the relation it is associated
 * with, the time it was triggered, and the number of calls made to it.
 * Triggers can be used to perform actions automatically in response to certain events,
 * such as logging changes, enforcing constraints, or updating related data.
 */
export type Trigger = {
  "Trigger Name": string;
  Relation: string;
  Time: number;
  Calls: number;
};

/**
 * This interface represents a node in a PostgreSQL query plan.
 * Each node corresponds to a specific operation in the query execution plan,
 * such as a scan, join, or aggregate operation. The node type is defined by the
 * "Node Type" property, which is of type Operation. The Plans property is an array
 * of child nodes, allowing for a hierarchical representation of the query plan.
 * Additional properties can include various metrics and details about the operation,
 * such as execution time, number of rows processed, and any triggers associated with the node.
 */
export interface IPlanNode {
  "Node Type": Operation;
  Plans?: IPlanNode[];
  [key: string]: string | IPlanNode[] | undefined | number;
}

export type PlanHead = {
  Plan: IPlanNode;
  "Planning Time": number;
  Triggers: Trigger[];
  "Execution Time": number;
};
