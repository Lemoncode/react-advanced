import { NameComponent } from "./name-component";

interface Props {
  name: string;
  onChange: (name: string) => void;
  time: string;
}

export const MyForm = (props: Props) => {
  return (
    <div>
      <NameComponent name={props.name} onChange={props.onChange} />
      <span>Current time: {props.time}</span>
    </div>
  );
};
