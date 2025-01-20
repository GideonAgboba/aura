import React from 'react';

type ConditionalViewProps = {
  if: {
    condition: boolean;
    render: JSX.Element;
  };
  elseIf?: Array<{
    condition: boolean;
    render: JSX.Element;
  }>;
  else?: JSX.Element;
};

export const ConditionalView: React.FC<ConditionalViewProps> = ({
  if: ifCondition,
  elseIf,
  else: elseComponent,
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
