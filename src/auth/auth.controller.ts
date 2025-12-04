import { Controller, Post, Body, Request, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth} from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { UserDto } from '../users/dto/user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './role.guard';

@ApiTags('Authentication')
@Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Connexion',
    description: 'Authentifie un utilisateur avec son username et password. Retourne un token JWT valide pendant 1 heure. Route publique, aucune authentification requise.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Connexion réussie - Token JWT retourné', schema: { type: 'object', properties: { access_token: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @ApiOperation({ 
    summary: 'Inscription',
    description: 'Crée un nouveau compte utilisateur. Le mot de passe est automatiquement hashé. Le rôle par défaut est "user" (peut être spécifié comme "admin" mais nécessite des privilèges). Route publique, aucune authentification requise.'
  })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès', type: UserDto })
  @ApiResponse({ status: 400, description: 'Données invalides ou username déjà utilisé' })
  async register(@Body() body: UserDto) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ 
    summary: 'Déconnexion',
    description: 'Déconnecte l\'utilisateur actuellement authentifié. Note: Le token JWT reste valide jusqu\'à expiration (1h). Nécessite une authentification JWT (rôle: user ou admin).'
  })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie', schema: { type: 'object', properties: { message: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  async logout() {
    return this.authService.logout();
  }
} 