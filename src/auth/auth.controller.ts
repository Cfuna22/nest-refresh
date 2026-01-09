import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { registerDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(
        @Body() dto: registerDto) {
        return this.authService.register(
            dto.email,
            dto.name,
            dto.password,
        );
    }

    @Post('login')
    login(
        @Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }
}
