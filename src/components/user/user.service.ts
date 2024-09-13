import { Injectable, Scope } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(private readonly respository: UserRepository) {}

  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // async createuser(userDto: any) {
  //   const encryptedSecret = Crypto();
  // }
}
