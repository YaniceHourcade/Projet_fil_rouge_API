# Projet fil rouge

__Description :__

Notre Projet fil rouge est une api de musique, on peut y retrouver différente route pour consulter des artistes, leur album et également leur concert, en aillant un compte vous avez aussi la possibilité de pouvoir avoir une liste d'artiste favoris.

## How start the project ?
```
npm install
prisma migrate dev
npm run dev
```

## Documentation
Swagger : http://localhost:3000/api

## Jeu de données
Un dump.sql est donné pour permettre d'avoir un base fourni avec de la donnée

Les identifiants du user admin test :
- Username : admin
- Mot de passe : admin

## Fonctionnalités

- Authentification 
 -> Connexion, Inscription, Déconnexion
- Routes protégés par des rôles
- Favoris
- Route filtrante 

--- 

seance du 13/11: 
pas de test encore fait
ajout anti-usurpation (un user ne peut ajouter en favoris que sur son propre compte)

seance du 01/12:




prochaine seance:
tester si l'auth marche
créer un user admin test
mettre la protection sur toutes les routes user et admin
test les favoris 
finir les routes du user
implementer concerts et albums


ptit interface?

seance suivante: 
probleme token pas reconnu ou pas bien lu
verifier bien toutes les routes
verifier la documentation,
deconnexion 
test favoris, 
securisé les routes,
apporter des parametres en plus exemple : un user peut soit avoir comme role user soit admin si différent rejeter la demande


pour demain : 


test route
