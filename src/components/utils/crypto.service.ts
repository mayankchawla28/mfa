import { Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import crypto from "crypto";

@Injectable({ scope: Scope.REQUEST })
export class CryptoService {
  private readonly algorithm: crypto.CipherGCMTypes; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly encryptionKey: any;
  private readonly configService = new ConfigService();
  constructor() {
    this.encryptionKey = this.configService.getOrThrow("ENCRYPTION_KEY");
    this.algorithm = this.configService.get("ENCRYPTION_ALGORITHM") || "aes-256-gcm";
    this.encryptionKey = Buffer.from(this.encryptionKey, "hex");
  }

  get getRandomUUID(): string {
    return crypto.randomUUID();
  }

  getRandomString(num: number = 8): string {
    return crypto.randomBytes(num).toString("hex");
  }

  getHashString(input: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(input);
    return hash.digest("hex");
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}.${tag}.${encrypted}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decrypt(encryptedData: any): string {
    const [ivHex, tagHex, content] = encryptedData.split(".");
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv);
    decipher.setAuthTag(tag);
    let dec = decipher.update(content, "hex", "utf8");
    dec += decipher.final("utf8");
    return dec;
  }
}
