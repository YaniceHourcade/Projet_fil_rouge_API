import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = { username: 'test', password: await bcrypt.hash('password', 10) };
        const isMatch = await bcrypt.compare(pass, user.password);
        if (user && isMatch) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
