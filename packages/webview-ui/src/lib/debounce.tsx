export function debounce<A extends []>(fn: (...args: A) => void, delay: number) {
  let timeout: Timer | null = null;
  return (...args: A) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
