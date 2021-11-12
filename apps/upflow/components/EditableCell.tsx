import React from "react";

const EditableCell = ({ value: initialValue, row, column, onUpdate }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    onUpdate({
      ...row,
      [column]: value,
    });
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      className="p-0 m-0 bg-transparent border-0"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default EditableCell;
