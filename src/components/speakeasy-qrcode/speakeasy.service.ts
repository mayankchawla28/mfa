import { BadRequestException, Injectable, Scope } from "@nestjs/common";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import { ConfigService } from "@nestjs/config";
import { keyLengthVal, issuerDefaultVal } from "@common/constant/constant";
import errorMessages from "@common/messages/errorMessages";

@Injectable({ scope: Scope.REQUEST })
export class SpeakeasyServices {
  private readonly issuer: string;
  private readonly keyLength: number = keyLengthVal;
  constructor(private readonly configService: ConfigService) {
    const issuer = this.configService.get<string>("ISSUER") || issuerDefaultVal;
    this.issuer = issuer;
  }

  private get getSecret(): string {
    const secret = speakeasy.generateSecret({ length: this.keyLength, issuer: this.issuer });
    return secret.base32;
  }

  private generateOtpauthURL(secret: string, userEmail: string, path: string) {
    // const otpauth = speakeasy.otpauthURL({ secret, label: userEmail, issuer: `${this.issuer} ${path}`});
    const otpauth = `otpauth://totp/${this.issuer}:${userEmail}?secret=${secret}&issuer=${this.issuer} ${path}`;
    return otpauth;
  }

  private async generateUrlQrCode(otpauth: string) {
    return await qrcode.toDataURL(otpauth);
  }

  async generateSecretQrcode(userEmail: string, path: string) {
    const secret = this.getSecret;
    const url = this.generateOtpauthURL(secret, userEmail, path);
    const qrcode = await this.generateUrlQrCode(url);
    return { secret, qrcode };
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 1,
    });
  }

  verify(secret: string, token1: string, token2: string) {
    const isFirstTokenValid = this.verifyToken(secret, token1);
    const isSecondTokenValid = this.verifyToken(secret, token2);
    if (isFirstTokenValid === false || isSecondTokenValid === false) {
      throw new BadRequestException(errorMessages.ERR0003.code);
    }
    return true;
  }
}
