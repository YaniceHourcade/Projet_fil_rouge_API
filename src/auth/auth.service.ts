import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService ) {}
  
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
          where: { username },
          select: { id: true, username: true, password: true, role: true },
        });
      
        if (!user) {
          return null; 
        }
      
        const isMatch = await bcrypt.compare(pass, user.password);
        if (isMatch) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    async login(user: any) {
        const payload = await this.validateUser(user.username, user.password);
        if (!payload) {
            throw new UnauthorizedException('Identifiants invalides');
        }
    
        const jwtPayload = {
          sub: payload.id,
          username: payload.username,
          role: payload.role,
        };
    
        return {
            access_token: this.jwtService.sign(jwtPayload),
        };
    }

    async register(user: any) {
      try {
        const newUser = await this.prisma.user.create({
          data: {
            username: user.username,
            password: await bcrypt.hash(user.password, 10),
            role: user.role || 'user',
          },
        });
  
        return newUser;
      } catch (error: any) {
        if (error?.code === 'P2002') {
          throw new UnauthorizedException('Nom d’utilisateur déjà utilisé');
        }
        throw error;
      }
    }

    async logout() {
        return {
            access_token: null,
            message: 'Déconnexion réussie',
        };
    }
}
