import { CryptoService } from "@components/utils/crypto.service";
import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { toDataURL } from "qrcode";
import { authenticator } from "otplib";
import { VerifyOtpDto } from "./dto/verify.otp.dto";

@Injectable({ scope: Scope.REQUEST })
export class OtplibQrCodeService {
  private readonly issuer: string;
  private readonly numberOfBytes: number;
  constructor(
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {
    this.issuer = this.configService.get<string>("ISSUER") || "demo";
    this.numberOfBytes = this.configService.get<number>("NUM_OF_BYTES") || 28;
    this.numberOfBytes = +this.numberOfBytes;
  }

  get getSecret(): string {
    return authenticator.generateSecret(this.numberOfBytes);
  }

  verifyCode(otp: string, secret: string): boolean {
    return authenticator.verify({ token: otp, secret });
  }

  async generateSecretKey(id: string) {
    const secret = this.getSecret;
    const qrCode = await this.generateQRCode(id, secret);
    return { secret, qrCode };
  }

  // generateSecret(): string {
  //   const secret = authenticator.generateSecret(this.numberOfBytes);
  //   // Store the secret in the database associated with the userId
  //   // Example: saveToDatabase(userId, secret);
  //   return secret;
  // }

  async verifyAndSave(verifyDto: VerifyOtpDto) {
    const isOtpVerified = this.verifyCode(verifyDto.otp, verifyDto.secret);
    if (isOtpVerified !== true) throw new BadRequestException();
    return isOtpVerified;
  }

  async generateQRCode(userId: string, secret: string) {
    const otpauthUrl = authenticator.keyuri(userId, this.issuer, secret);
    return toDataURL(otpauthUrl);
  }

  async regenerateSecret(userId: string) {
    return await this.generateSecretKey(userId);
  }
}
