import { TextDocument } from "vscode";
import { ClassNamesResult, classNamesResultSchema } from "../ast/ClassNames/getClassNames";
import { TypeScriptStartError, waitForTypeScriptServer } from "./waitForTypeScriptServer";
import { classNamesPosition } from "./classNameFile";
import { ZodError } from "zod";

export type EventListener = () => void;
export type EventType = "programCompile";

export class TypeScriptServerApi {
  private _ensureReadyPromise: Promise<void> | null = null;
  private _eventListeners: Record<EventType, EventListener[]> = {
    programCompile: [],
  };

  constructor(private _port: number) {}

  /**
   * The port on which the TypeScript server is running.
   */
  get port() {
    return this._port;
  }

  /**
   * Send a JSON POST request to the TypeScript server.
   */
  private async post(path: string, body: any) {
    await this.ensureReady();
    const res = await fetch(`http://localhost:${this.port}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  /**
   * Ensure that the TypeScript server is ready to accept requests.
   */
  public async ensureReady() {
    if (!this._ensureReadyPromise) {
      this._ensureReadyPromise = waitForTypeScriptServer(this.port);
    }
    await this._ensureReadyPromise;
  }

  public async getSimpleAST(fileName: string) {
    return this.post("/", {
      fileName,
    });
  }

  public async getClassNames(
    fileName: string,
    position: number,
    document: TextDocument
  ) {
    try {      
      const result = classNamesResultSchema.safeParse(await this.post("/classnames", {
        fileName,
        position,
      }));

      if (!result.success) {
        throw result.error;
      }

      return classNamesPosition(result.data, document);
    } catch (error) {
      if (error instanceof TypeScriptStartError) {
        throw error;
      } else if (error instanceof ZodError) {
        console.error(`Error in getClassNames: ${error.errors}`);
      } else if (error instanceof Error) {
        console.error(`Error in getClassNames: ${error.message}`);
      } else {
        console.error("Error in getClassNames", error);
      }
    }
  }

  private startProgramCompileEventLoop() {
    const loop = async () => {
      try {
        // Wait for the program to compile
        await this.post("/program-compile-event", {});
      } catch (error) {
        console.error("Error in program compile event loop:", error);
      }
      if (this._eventListeners.programCompile.length > 0) {
        // Notify listeners
        for (const listener of this._eventListeners.programCompile) {
          listener();
        }
        // Continue the loop
        setTimeout(loop, 0);
      }
    };
    // Start the loop
    setTimeout(loop, 0);
  }

  public addEventListener(type: EventType, callback: EventListener) {
    if (
      type === "programCompile" &&
      this._eventListeners.programCompile.length === 0
    ) {
      // Start the event loop
      this.startProgramCompileEventLoop();
    }
    this._eventListeners[type].push(callback);
  }

  public removeEventListener(type: EventType, callback: EventListener) {
    this._eventListeners[type] = this._eventListeners[type].filter(
      (cb) => cb !== callback
    );
  }
}
