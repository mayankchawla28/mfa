import { Body, Controller, Post } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Controller("user")
export class UserController {
  constructor(private readonly service: UserRepository) {}

  @Post("create")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async createUser(@Body() createUserDto: any) {
    const response = await this.service.createUser(createUserDto);
    return response;
  }

  @Post("one")
  async findOneUser() {}
}
