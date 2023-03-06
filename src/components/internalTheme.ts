import {get} from 'lodash';
export const getValue = (
  theme: any,
  objectPath: string,
  defaultValue: string | null,
) => {
  let value = get(theme, objectPath, defaultValue);
  if (!value) {
    return defaultValue;
  }
  if (value.startsWith('@')) {
    if (theme._variables.hasOwnProperty(value)) {
      value = theme._variables[value];
    } else {
      value = defaultValue;
    }
  }
  return value;
};
