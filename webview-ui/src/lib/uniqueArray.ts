export function uniqueArray<T>(styles: T[]): T[] {
  return [...new Set(styles)];
}
