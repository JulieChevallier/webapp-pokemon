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
