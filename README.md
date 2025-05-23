# Pokemon Search

Ce projet est une application web Flask permettant de rechercher des Pokémon en français, d'obtenir des suggestions de noms, d'afficher des informations détaillées sur chaque Pokémon ainsi qu'un jeu pour découvrir le pokémon caché. Ce code à été réalisé grâce à l'API [PokeAPI](https://pokeapi.co/).
![Pokemon Search](/static/PokemonSearch.png)

## 2. Fonctionnalités
- **Auto-complétion** : Suggestions de noms de Pokémon basées sur les premières lettres entrées.
- **Recherche d'informations** : Affichage des détails d'un Pokémon (nom, description, image, n° Pokédex, type(s), taille, poids).
- **Mode Jeu** : Devinez un Pokémon en comparant ses caractéristiques avec un Pokémon aléatoire.

## 3. Technologies Utilisées
- **Backend** : Flask (Python)
- **Frontend** : HTML, CSS, JavaScript
- **Base de données** : API [PokeAPI](https://pokeapi.co/) & Liste des Pokémon en français récupérée depuis un fichier JSON sur GitHub [(ici)](https://raw.githubusercontent.com/sindresorhus/pokemon/main/data/fr.json)
- **Tests** : Pytest
- **Déploiement** : Docker, GitHub Actions CI/CD

---

## 4. Installation et Exécution

### 4.1 Prérequis
- **Python 3.9+**
- **pip** (gestionnaire de paquets Python)
- **Docker** (pour l'exécution dans un conteneur)

### 4.2 Installation
Clonez le projet et installez les dépendances :
```bash
$ git clone https://github.com/JulieChevallier/webapp-pokemon/
$ cd webapp-pokemon
$ pip install -r requirements.txt
```

### 4.3 Exécution Locale
Lancez l'application Flask :
```bash
$ python3 app.py
```
L'application sera accessible à l'adresse : [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 5. API Endpoints

### 5.1 Accueil
- **GET /**
- Retourne la page HTML principale avec la liste des Pokémon.

### 5.2 Auto-complétion
- **GET /autocomplete?q=nom_partiel**
- Retourne une liste de suggestions de noms de Pokémon correspondant au préfixe entré.

### 5.3 Informations sur un Pokémon
- **GET /pokemon_info?name=NomDuPokemon**
- Retourne un JSON avec le nom, la description et l'image du Pokémon demandé.

Exemple de réponse :
```json
{
  "description": "Il lui arrive de remettre d’aplomb un Pikachu allié en lui envoyant une décharge électrique.",
  "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "name": "Pikachu"
}
```
### 5.4 Mode Jeu
- **GET /random_pokemon**
- Retourne un Pokémon aléatoire pour servir de référence dans le mode jeu.

Exemple de réponse :

```json
{
  "id": 150,
  "name": "Mewtwo",
  "type_1": "Psy",
  "type_2": null,
  "height": 20,
  "weight": 1220,
  "generation": 1
}
```

---

## 6. Tests

### 6.1 Exécution des Tests
Lancez les tests avec Pytest :
```bash
$ pytest test.py
```
Les tests vérifient :
- L'affichage de la page d'accueil.
- Le bon fonctionnement de l'auto-complétion.
- La récupération correcte des informations d'un Pokémon.

---

## 7. Déploiement avec Docker

### 7.1 Construction de l'image Docker
```bash
$ docker build -t webapp-pokemon .
```

### 7.2 Exécution du Conteneur
```bash
$ docker run -p 5000:5000 webapp-pokemon
```
L'application sera accessible à l'adresse : [http://127.0.0.1:5000](http://127.0.0.1:5000)
---

## 8. CI/CD avec GitHub Actions
Trois workflows GitHub Actions sont configurés pour automatiser le test et le déploiement de l'application :

### 8.1 Workflow `main.yml`
Ce workflow se déclenche lors d'un push ou d'une pull request sur la branche `main` et effectue les étapes suivantes :
1. **Exécute les tests** avec pytest.
2. **Construit l'image Docker** après validation des tests.
3. **Pousse l'image sur Docker Hub**.
4. **Exécute un test d'intégration** pour vérifier que l'application démarre correctement.

### 8.2 Workflow `release.yml`
Ce workflow est déclenché lorsqu'un tag de version (`vX.Y.Z`) est poussé ou lorsqu'une release est publiée sur GitHub. Il effectue les mêmes étapes que `main.yml`, mais pousse l'image Docker avec le tag correspondant à la version (`vX.Y.Z`).

### 8.3 Workflow `test-only.yml`
Ce workflow est exécuté sur toutes les branches sauf `main` et permet d'exécuter uniquement les tests avec pytest. Il est utile pour valider les modifications avant de les fusionner sur `main`.

Les fichiers de configuration des workflows sont situés dans `.github/workflows/`.

---
