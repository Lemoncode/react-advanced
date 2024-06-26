import classes from "./column.component.module.css";
import { CardContent } from "../../model";
import { Card } from "../card/card.component";
import { EmptySpaceDropZone } from "../empty-space-drop-zone.component";

interface Props {
  columnId: number;
  name: string;
  content: CardContent[];
}

export const Column: React.FC<Props> = (props) => {
  const { name, content, columnId } = props;

  return (
    <div className={classes.container}>
      <h4>{name}</h4>
      {content.map((card) => (
        <Card key={card.id} content={card} columnId={columnId} />
      ))}
      <EmptySpaceDropZone columnId={columnId} />
    </div>
  );
};
