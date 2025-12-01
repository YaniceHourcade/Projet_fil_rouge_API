import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // L'utilisateur est attaché à la requête par le JwtAuthGuard

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Accès réservé aux administrateurs');
    }

    return true; // Autorise l'accès si l'utilisateur est un administrateur
  }
}