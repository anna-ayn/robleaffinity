import Select from "react-select";
import PropTypes from "prop-types";

export default function MultiSelect({ options, name, fun, saved }) {
  MultiSelect.propTypes = {
    options: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    fun: PropTypes.func.isRequired,
    saved: PropTypes.array.isRequired,
  };

  console.log(saved);

  return (
    <Select
      options={options}
      isMulti
      className="basic-multi-select text-gray-700 w-full"
      classNamePrefix="select"
      name={name}
      onChange={(e) => fun(e ? e.map((x) => x.value) : [])}
      isClearable
      isSearchable
      defaultValue={saved.map((x) => ({ value: x, label: x }))}
    />
  );
}
