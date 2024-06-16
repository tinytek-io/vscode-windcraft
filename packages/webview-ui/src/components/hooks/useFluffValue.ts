import type { CurrentAppliedType, UIValue } from "../../types/general";

function getSuffixValue<T>(className: string | undefined, exactClass: string, exactValue: NoInfer<T>): T | undefined {
  if (!className) {
    return;
  }
  if (className === exactClass) {
    return exactValue;
  }
  return className.split("-").pop() as T;
}

type GetValueOneOf = (options: string[], endOfStyles?: string) => CurrentAppliedType<UIValue | undefined>;

export function getFluffValue<T>(
  getValueOneOf: GetValueOneOf,
  exactClass: string,
  exactValue: NoInfer<T>,
  oneOf: string[],
  endOfStyles?: string
): CurrentAppliedType<T | undefined> {
  const oneOfValue = getValueOneOf([...oneOf, exactClass], endOfStyles);

  return {
    current: getSuffixValue<T>(oneOfValue.current, exactClass, exactValue),
    applied: getSuffixValue<T>(oneOfValue.applied, exactClass, exactValue)
  };
}
