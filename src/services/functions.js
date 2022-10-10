export default class functions {
  static isValidTextField = (field) => {
    if (field === undefined || field === null || field === "") return false;
    return true;
  };
  static isEmptyArray = (arr) => {
    if (arr === undefined || arr === null || arr.length <= 0) return true;
    return false;
  };
}
