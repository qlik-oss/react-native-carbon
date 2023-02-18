import {get} from 'lodash';
export const getValue = (
  theme: any,
  objectPath: string,
  defaultValue: string,
) => {
  let value = get(theme, objectPath, defaultValue);
  if (value.startsWith('@')) {
    if (theme._variables.hasOwnProperty(value)) {
      value = theme._variables[value];
    } else {
      value = defaultValue;
    }
  }
  return value;
};
