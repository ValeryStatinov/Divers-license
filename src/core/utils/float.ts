export type Vector3Array = [number, number, number];

export const isFloatEqual = (f1: number, f2: number) => {
  return Math.abs(f1 - f2) < 0.000001;
};

export const isVector3ArrayEqual = (v1: Vector3Array, v2: Vector3Array) => {
  return isFloatEqual(v1[0], v2[0]) && isFloatEqual(v1[1], v2[1]) && isFloatEqual(v1[2], v2[2]);
};
