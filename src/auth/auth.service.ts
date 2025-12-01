import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService ) {}
  
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
          where: { username },
          select: { username: true, password: true, role: true }, // Inclure le rôle ici
        });
      
        if (!user) {
          return null; 
        }
      
    //    const isMatch = await bcrypt.compare(pass, user.password);
    //    if (isMatch) {
    //      const { password, ...result } = user;
    //      return result;
    //    }
      
        const { password, ...result } = user;
        return result;
      }

    async login(user: any) {
        // Ensure validateUser is awaited to handle asynchronous behavior
        const payload = await this.validateUser(user.username, user.password);
        console.log('Payload JWT:', payload);
        if (!payload) {
            throw new Error('Invalid credentials'); // Handle invalid user credentials
        }
    
        console.log('Payload JWT:', payload); // Log the payload for debugging
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
