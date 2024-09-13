import { Body, Controller, Get, Post, Render, ValidationPipe } from "@nestjs/common";
import { OtplibQrCodeService } from "./otplib-qrcode.services";
import { VerifyOtpDto } from "./dto/verify.otp.dto";

@Controller("otplib")
export class OtplibController {
  constructor(private readonly service: OtplibQrCodeService) {}

  @Get("index")
  @Render("otplib-qrcode")
  async showForm() {
    return { qrCode: "", secret: "" };
  }

  @Post("generate")
  @Render("otplib-qrcode")
  async generate(@Body(ValidationPipe) id: string) {
    console.log("object tg", id);
    const { qrCode, secret } = await this.service.generateSecretKey(id);
    return { qrCode, secret };
  }

  @Render("otplib-qrcode")
  @Post("verify/otp")
  verifyOtp(@Body(ValidationPipe) verifyDto: VerifyOtpDto) {
    const response = this.service.verifyAndSave(verifyDto);
    return response;
  }

  @Post("validate/login")
  validateLogin() {}

  @Post("regenerate")
  @Render("otplib-qrcode")
  async resetSecret(@Body(ValidationPipe) id: string) {
    const { qrCode, secret } = await this.service.regenerateSecret(id);
    return { qrCode, secret };
  }
}
