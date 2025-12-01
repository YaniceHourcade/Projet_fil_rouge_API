import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '5724b9b0a8a68418c0e6727753f398dce7b997ec41f68f42cbf7a5da501707fcfeb3711f3289b902e9dedeaa4f265e1dc4585bf0412fe7eb2c0931044b04f05a', 
      
    });
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
  }

  async validate(payload: any) {
    console.log('Payload reçu dans JwtStrategy:', payload); // Log pour vérifier le payload
    
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}