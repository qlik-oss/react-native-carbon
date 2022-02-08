export const buildEvent = (nativeEvent) => {
  if (nativeEvent.transformed || nativeEvent.touches === undefined) {
    return nativeEvent;
  }
  if (nativeEvent.touches.length === 0) {
    nativeEvent.touches.push({
      locationX: nativeEvent.locationX,
      locationY: nativeEvent.locationY,
    });
  }
  return {
    transformed: true,
    clientX: nativeEvent.locationX,
    clientY: nativeEvent.locationY,
    touches: nativeEvent.touches.map((evt) => {
      return {
        clientX: evt.locationX,
        clientY: evt.locationY,
      };
    }),
    changedTouches: nativeEvent.changedTouches.map((evt) => {
      return {
        clientX: evt.locationX,
        clientY: evt.locationY,
      };
    }),
  };
};
