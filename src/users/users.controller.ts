import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ 
    summary: 'Récupérer les informations de l\'utilisateur connecté',
    description: 'Retourne les informations de l\'utilisateur actuellement authentifié, y compris sa liste de favoris. Nécessite une authentification JWT (rôle: user ou admin).'
  })
  @ApiResponse({ status: 200, description: 'Informations de l\'utilisateur connecté', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  getUserConnected(@Req() req: any): Promise<User> {
    const id = req.user.id;
    return this.userService.findUser(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Get('all')
  @ApiOperation({ 
    summary: 'Récupérer tous les utilisateurs',
    description: 'Retourne la liste de tous les utilisateurs de l\'application. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiResponse({ status: 200, description: 'Liste de tous les utilisateurs', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  getAllUsers() : Promise<User[]> { 
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
    description: "Identifiant unique de l'utilisateur",
  })
  @Get(':id')
  @ApiOperation({ 
    summary: 'Récupérer un utilisateur par ID',
    description: 'Retourne les informations d\'un utilisateur spécifique par son ID, y compris sa liste de favoris. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiResponse({ status: 200, description: 'Informations de l\'utilisateur', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  getUser(@Param('id') id: number) : Promise<User> { 
    return this.userService.findUser(id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Supprimer un utilisateur par ID',
    description: 'Supprime définitivement un utilisateur de l\'application. Nécessite une authentification JWT avec le rôle ADMIN uniquement.'
  })
  @ApiParam({ name: 'id', type: 'number', description: "ID de l'utilisateur à supprimer" })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Accès interdit - Rôle admin requis' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('update')
  @ApiOperation({ 
    summary: 'Modifier son propre profil utilisateur',
    description: 'Permet à un utilisateur authentifié de modifier ses propres informations (username, password). Le rôle ne peut pas être modifié via cette route. Nécessite une authentification JWT (rôle: user ou admin).'
  })
  @ApiBody({ type: UserDto })
  @ApiResponse({ status: 200, description: 'Profil utilisateur mis à jour avec succès', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 403, description: 'Tentative de modification du rôle interdite' })
  async updateUser(@Req() req: any, @Body() body: Partial<UserDto>): Promise<User> {
    const userId = req.user.id;
    return this.userService.updateUser(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'artistId',
    type: Number,
    description: "ID de l'artiste à ajouter en favoris",
  })
  @Patch('fav/add/:artistId')
  @ApiOperation({ 
    summary: 'Ajouter un artiste en favoris',
    description: 'Ajoute un artiste à la liste des favoris de l\'utilisateur connecté. Nécessite une authentification JWT (rôle: user ou admin).'
  })
  @ApiResponse({ status: 200, description: 'Artiste ajouté en favoris avec succès', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 404, description: 'Artiste ou utilisateur non trouvé' })
  async addFav(@Req() req: any, @Param('artistId') artistId: number): Promise<User> {
    const userId = req.user.id;
    return this.userService.addFav(userId, artistId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'artistId',
    type: Number,
    description: "ID de l'artiste à retirer des favoris",
  })
  @Patch('fav/del/:artistId')
  @ApiOperation({ 
    summary: 'Retirer un artiste des favoris',
    description: 'Retire un artiste de la liste des favoris de l\'utilisateur connecté. Nécessite une authentification JWT (rôle: user ou admin).'
  })
  @ApiResponse({ status: 200, description: 'Artiste retiré des favoris avec succès', type: UserDto })
  @ApiResponse({ status: 401, description: 'Non authentifié - Token JWT manquant ou invalide' })
  @ApiResponse({ status: 404, description: 'Artiste ou utilisateur non trouvé' })
  async delFav(@Req() req: any, @Param('artistId') artistId: number): Promise<User> {
    const userId = req.user.id;
    return this.userService.delFav(userId, artistId);
  }
}
