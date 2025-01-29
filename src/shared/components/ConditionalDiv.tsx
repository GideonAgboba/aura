import React from "react";

interface Condition {
  condition: boolean;
  render: React.ReactElement<any, any> | null;
}

interface ConditionalDivProps {
  if: Condition;
  elseIf?: Condition[];
  else?: React.ReactElement<any, any> | null;
}

export const ConditionalDiv: React.FC<ConditionalDivProps> = ({
  if: ifCondition,
  elseIf,
  else: elseComponent = null,
}) => {
  if (ifCondition.condition) {
    return ifCondition.render;
  }

  if (elseIf) {
    for (const condition of elseIf) {
      if (condition.condition) {
        return condition.render;
      }
    }
  }

  return elseComponent;
};
