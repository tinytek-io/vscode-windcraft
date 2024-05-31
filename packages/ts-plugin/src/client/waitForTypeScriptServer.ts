export class TypeScriptStartError extends Error {
  constructor() {
    super("Failed to start TypeScript Server");
  }
}

export async function waitForTypeScriptServer(port: number) {
  const maxAttempts = 10;
  const delay = 300;
  let attempt = 0;
  let success = false;
  while (attempt < maxAttempts) {
    try {
      const res = await fetch(`http://localhost:${port}/ready-check`);
      if (res.status === 200) {
        success = true;
        break;
      }
    } catch (error) {
      console.info("Waiting for TypeScript Server");
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
    attempt++;
  }
  if (!success) {
    throw new TypeScriptStartError();
  }
}
