import classes from "./input-info.component.module.css";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputInfo: React.FC<Props> = (props: Props) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Aquí pongo mi código");
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={classes.container}>
      <input type="number" {...props} onChange={(e) => handleOnChange(e)} />
      <label>{props.label}</label>
    </div>
  );
};
