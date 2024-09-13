/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Injectable, Logger, NestMiddleware, Scope } from "@nestjs/common";
import { CryptoService } from "@components/utils/crypto.service";

@Injectable({ scope: Scope.REQUEST })
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);
  private readonly utils = new CryptoService();
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, headers } = req;
    const requestId = this.utils.getRandomUUID;
    if (method === "GET") {
      return next();
    }
    headers.requestId = requestId;
    console.time(`Request-response time {reqID: ${requestId}}`);

    this.logger.log(`${method}: ${originalUrl}`, `[START => '${method}'] {reqID: ${requestId}}`);
    this.logger.log(JSON.stringify(body), `[REQUEST BODY] {reqID: ${requestId}}`);

    this.getResponse(res, requestId);
    res.on("finish", () => {
      this.logger.log(
        `${method}: ${originalUrl} - Status: ${res.statusCode}`,
        `[FINISHED => '${method}'] {reqID: ${requestId}}`,
      );
      console.timeEnd(`Request-response time {reqID: ${requestId}}`);
    });
    next();
  }

  getResponse(res: Response, requestId: string) {
    const oldWrite = res.write;
    const oldEnd = res.end;

    const chunks: Buffer[] = [];

    res.write = (...restArgs: any[]) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      return oldWrite.apply(res, restArgs as [any, BufferEncoding]);
    };

    res.end = (...restArgs: any[]) => {
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const responseBody = Buffer.concat(chunks).toString("utf8");

      const responseBodyObj = JSON.parse(responseBody);
      this.logger.log(JSON.stringify(responseBodyObj), `[RESPONSE BODY] {reqID: ${requestId}}`);

      return oldEnd.apply(res, restArgs as [any, BufferEncoding]);
    };
  }
}
