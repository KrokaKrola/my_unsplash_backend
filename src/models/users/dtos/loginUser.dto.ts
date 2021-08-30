import { PickType } from "@nestjs/swagger";
import { RegisterUserDto } from "./registerUser.dto";

export class LoginUserDto extends PickType(RegisterUserDto, ['username', 'password']) {};