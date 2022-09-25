import React from "react";
import { CardContent } from "../model";
import classes from "./card.component.css";

interface Props {
  content: CardContent;
}

export const Card: React.FC<Props> = (props) => {
  const { content } = props;

  return (
    <div className={classes.card}>
      <div className={classes.dragHandle} />
      {content.title}
    </div>
  );
};
