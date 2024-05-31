import { TextDocument } from "vscode";
import { ClassNamesResult } from "../ast/ClassNames/getClassNames";
import { waitForTypeScriptServer } from "./waitForTypeScriptServer";
import { classNamesPosition } from "./classNameFile";

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
  private async ensureReady() {
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
    console.log("getClassNames", fileName, position);
    try {      
      const classNamesResult = (await this.post("/classnames", {
        fileName,
        position,
      })) as ClassNamesResult | undefined;
  
      if (!classNamesResult || !classNamesResult.classNames) {
        console.error("Error in getClassNames: No class names found");
        return undefined;
      }
  
      return classNamesPosition(classNamesResult, document);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(`Error in getClassNames: ${message}`);
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
