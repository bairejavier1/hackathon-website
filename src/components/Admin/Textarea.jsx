const Textarea = ({ value, setValue }) => {
  return (
    <textarea
      className="w-full h-full border-2 rounded-md p-2 resize-none outline-none"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default Textarea;
