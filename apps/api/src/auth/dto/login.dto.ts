import { createZodDto } from "nestjs-zod";
import { loginSchema } from "@teste-eteg/shared";

export class LoginDto extends createZodDto(loginSchema) { }