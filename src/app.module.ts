// import { CommonModule } from "@common/common.module";
import { OtplibController } from "@components/otplib-qrcode/otplib-qrcode.controller";
import { OtplibQrCodeService } from "@components/otplib-qrcode/otplib-qrcode.services";
import { SpeakeasyController } from "@components/speakeasy-qrcode/speakeasy.controller";
import { SpeakeasyServices } from "@components/speakeasy-qrcode/speakeasy.service";
import { CryptoService } from "@components/utils/crypto.service";
import appConfig from "@config/app.config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    // CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
  controllers: [OtplibController, SpeakeasyController],
  providers: [OtplibQrCodeService, SpeakeasyServices, CryptoService],
})
export class AppModule {}
