export default class settings_functions {
  static updateTextState = (
    state,
    setState,
    value,
    index,
    addingMethod,
    prop_name
  ) => {
    var arr = state;
    arr[index][prop_name] = value;
    setState([...arr]);
    addingMethod(index);
  };
  static updateNumbersState = (
    state,
    setState,
    value,
    index,
    addingMethod,
    prop_name
  ) => {
    if (value !== "" && !/^[0-9]+$/.test(value)) return;

    var arr = state;
    arr[index][prop_name] = value;
    setState([...arr]);
    addingMethod(index);
  };
  static updateFloatNumbersState = (
    state,
    setState,
    value,
    index,
    addingMethod,
    prop_name
  ) => {
    if (value !== "" && (isNaN(parseFloat(value)) || /[a-zA-Z]/g.test(value)))
      return;

    var arr = state;
    arr[index][prop_name] = value;
    setState([...arr]);
    addingMethod(index);
  };
  static updateBoolState = (
    state,
    setState,
    value,
    index,
    addingMethod,
    prop_name
  ) => {
    var arr = state;
    arr[index][prop_name] = value ? 1 : 0;
    setState([...arr]);
    addingMethod(index);
  };
}
