import { NameComponent } from "./name-component";

interface Props {
  name: string;
  onChange: (name: string) => void;
  time: string;
}

export const MyForm = (props: Props) => {
  const { time } = props;

  return (
    <div>
      <NameComponent {...props} />
      <span>Current time: {time}</span>
    </div>
  );
};
