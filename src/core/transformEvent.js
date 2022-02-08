import { buildEvent } from "./buildEvent";

export const transformEvent = (nativeEvent, _children) => {
  const event = buildEvent(nativeEvent);
  return event;
};
