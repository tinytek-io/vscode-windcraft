export function generateUUID() {
  let d2 = performance.now() * 1000;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    r = (d2 + r) % 16 | 0;
    d2 = Math.floor(d2 / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}