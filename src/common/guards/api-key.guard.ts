import errorMessages from "@common/messages/errorMessages";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly apiKey: string;
  private readonly configService = new ConfigService();
  constructor() {
    this.apiKey = this.configService.getOrThrow<string>("API_KEY");
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (apiKey && apiKey === this.apiKey) {
      return true;
    }

    throw new UnauthorizedException(errorMessages.ERR0002.message);
  }
}
