import { Body, Controller, Post } from "@nestjs/common";
import { SpeakeasyServices } from "./speakeasy.service";

@Controller("speakeasy")
export class SpeakeasyController {
  constructor(private readonly service: SpeakeasyServices) {}

  @Post("generate")
  async generateMfa(@Body("email") email: string, @Body("path") path: string) {
    const response = await this.service.generateSecretQrcode(email, path);
    return { data: response };
  }

  @Post("verify/otp")
  verifyMfa(@Body("secret") secret: string, @Body("token1") token1: string, @Body("token2") token2: string) {
    const response = this.service.verify(secret, token1, token2);
    return { data: response };
  }
}
