# Projet fil rouge

## How start the project ?
```
npm install
prisma migrate dev
npm run dev
```

## Documentation
Swagger : http://localhost:3000/api


seance du 13/11: 
ajout de l'auth
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
