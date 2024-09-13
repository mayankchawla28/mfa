// import { timeoutValue } from "@common/constant/constants";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  RequestTimeoutException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly timeoutValue: number;
  private readonly logger = new Logger(TimeoutInterceptor.name);
  private readonly configService = new ConfigService();
  constructor() {
    this.timeoutValue = this.configService.get<number>("TIMEOUTVALUE") || 3000;
    this.timeoutValue = Number(this.timeoutValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutValue),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  }
}
