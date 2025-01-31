export const toValidNumber = (value: number, defaultValue = 0): number =>
  isNaN(value) ? defaultValue : value;
