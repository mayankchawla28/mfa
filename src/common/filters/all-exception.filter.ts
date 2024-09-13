import { nodeEnv } from "@common/constant/constant";
import { CustomExceptionResponse } from "@common/interfaces/custom-response.interface";
import errorMessages from "@common/messages/errorMessages";
import { CryptoService } from "@components/utils/crypto.service";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class AllExceptionFilter<T extends HttpException> implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  private readonly utils = new CryptoService();
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, originalUrl, query, headers, params, body } = request;
    const requestId = headers?.requestId || this.utils.getRandomUUID;

    try {
      const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.BAD_REQUEST;
      const exceptionResponse = exception.getResponse() as CustomExceptionResponse;
      const { statusCode = status, message = exception.message, error = exception.name } = exceptionResponse;

      const stack = exception["stack"] || message;

      this.logger.debug(
        `${method}: ${originalUrl};
        Params: ${JSON.stringify(params)};
        Query: ${JSON.stringify(query)};
        Body: ${JSON.stringify(body)};`,
        `[DEBUG => '${method}':- '${originalUrl}'] {reqID: ${requestId}}`,
      );
      this.logger.error(JSON.stringify(exception), `ExceptionFilter [${originalUrl}]: {reqID: ${requestId}}`);
      this.logger.error(
        JSON.stringify({ stack }),
        `ExceptionFilter-stack [${originalUrl}]: {reqID: ${requestId}}`,
      );

      response.status(status).json({
        statusCode,
        success: false,
        message: message,
        error,
        path: originalUrl,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === nodeEnv && { stack }),
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error), `ExceptionFilter processing error: {reqID: ${requestId}}`);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: errorMessages.ERR0000.message,
        error: "Internal Server Error.",
        path: originalUrl,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
