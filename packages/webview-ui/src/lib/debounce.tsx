export function debounce(fn: Function, delay: number) {
  let timeout: Timer | null = null;
  return (...args: any[]) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
