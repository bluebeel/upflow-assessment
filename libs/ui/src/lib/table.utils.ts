export const byTextAscending =
  <T extends Record<string, any>>(getTextProperty: (object: T) => string) =>
  (objectA: T, objectB: T) => {
    const upperA = getTextProperty(objectA).toUpperCase();
    const upperB = getTextProperty(objectB).toUpperCase();
    if (upperA < upperB) {
      return -1;
    }
    if (upperA > upperB) {
      return 1;
    }
    return 0;
  };

export const byTextDescending =
  <T extends Record<string, any>>(getTextProperty: (object: T) => string) =>
  (objectA: T, objectB: T) => {
    const upperA = getTextProperty(objectA).toUpperCase();
    const upperB = getTextProperty(objectB).toUpperCase();
    if (upperA > upperB) {
      return -1;
    }
    if (upperA < upperB) {
      return 1;
    }
    return 0;
  };

export function getFirstDefined(...args: any[]) {
  for (let i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i];
    }
  }
}
