import infoMessages from "@common/messages/infoMessages";
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface Response<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}

@Injectable()
export class WrapResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        success: true,
        message: data.message?.message || infoMessages.INFO0000.message,
        messageCode: data.message?.code || infoMessages.INFO0000.code,
        data: data,
      })),
    );
  }
}
