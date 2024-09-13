import { CommonModule } from "@common/common.module";
import { OtplibController } from "@components/otplib-qrcode/otplib-qrcode.controller";
import { OtplibQrCodeService } from "@components/otplib-qrcode/otplib-qrcode.services";
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
  controllers: [OtplibController],
  providers: [OtplibQrCodeService, CryptoService],
})
export class AppModule {}
