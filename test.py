import pytest
from app import app, pokemon_fr_names

def test_home_route():
    """Teste si la route '/' retourne un statut 200 et charge la page correctement."""
    with app.test_client() as client:
        response = client.get('/')
        assert response.status_code == 200
        assert b'<title>' in response.data

def test_autocomplete_no_query():
    """Teste si la route /autocomplete retourne une liste vide sans paramètre 'q'."""
    with app.test_client() as client:
        response = client.get('/autocomplete')
        assert response.status_code == 200
        assert response.json == []

def test_autocomplete_partial_match():
    """Teste si la route /autocomplete retourne une liste correcte pour un préfixe valide."""
    with app.test_client() as client:
        if pokemon_fr_names:
            query = pokemon_fr_names[0][:2].lower()
            response = client.get(f'/autocomplete?q={query}')
            assert response.status_code == 200
            assert len(response.json) <= 5
            assert all(name.lower().startswith(query) for name in response.json)

def test_autocomplete_no_match():
    """Teste si la route /autocomplete retourne une liste vide pour un préfixe inexistant."""
    with app.test_client() as client:
        response = client.get('/autocomplete?q=xyz')
        assert response.status_code == 200
        assert response.json == []

def test_pokemon_info():
    """Teste si la route /pokemon_info retourne les informations d'un Pokémon correctement."""
    with app.test_client() as client:
        pokemon_name = 'Pikachu'
        response = client.get(f'/pokemon_info?name={pokemon_name}')
        assert response.status_code == 200
        data = response.json
        assert "name" in data
        assert "description" in data
        assert "image" in data
        assert data["name"].lower() == pokemon_name.lower()
        assert data["description"]
        assert data["image"].startswith("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/")


def test_pokemon_image():
    """Teste si l'image du Pokémon est correctement récupérée."""
    with app.test_client() as client:
        pokemon_name = 'Pikachu'
        response = client.get(f'/pokemon_info?name={pokemon_name}')
        assert response.status_code == 200
        data = response.json
        assert 'image' in data
        assert data['image'].startswith('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/')