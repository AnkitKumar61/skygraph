import { createServer, type Server } from "node:http";

import type { Express } from "express";

import type { LifecycleResource } from "../../application/ports/lifecycle-resource.js";

export interface ListeningAddress {
  readonly host: string;
  readonly port: number;
}

export class HttpServer implements LifecycleResource {
  readonly name = "http-server";
  private readonly server: Server;
  private closePromise?: Promise<void>;

  constructor(application: Express) {
    this.server = createServer(application);
  }

  start(host: string, port: number): Promise<ListeningAddress> {
    return new Promise((resolve, reject) => {
      const onError = (error: Error): void => {
        this.server.off("listening", onListening);
        reject(error);
      };
      const onListening = (): void => {
        this.server.off("error", onError);
        const address = this.server.address();
        if (address === null || typeof address === "string") {
          reject(new Error("HTTP server did not expose a TCP listening address."));
          return;
        }
        resolve({ host: address.address, port: address.port });
      };

      this.server.once("error", onError);
      this.server.once("listening", onListening);
      this.server.listen(port, host);
    });
  }

  close(): Promise<void> {
    this.closePromise ??= new Promise((resolve, reject) => {
      if (!this.server.listening) {
        resolve();
        return;
      }
      this.server.close((error) => {
        if (error === undefined) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
    return this.closePromise;
  }

  forceClose(): void {
    this.server.closeAllConnections();
  }
}
