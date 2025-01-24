from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)
POKEMON_FR_URL = "https://raw.githubusercontent.com/sindresorhus/pokemon/main/data/fr.json"

try:
    response = requests.get(POKEMON_FR_URL)
    response.raise_for_status()
    pokemon_fr_names = response.json()
except Exception:
    pokemon_fr_names = []

@app.route('/')
def home():
    return render_template('index.html', pokemon_fr_names=pokemon_fr_names)

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify([])
    suggestions = [name for name in pokemon_fr_names if name.lower().startswith(query)]    
    return jsonify(suggestions[:5])

@app.route('/pokemon_info', methods=['GET'])
def pokemon_info():
    name = request.args.get('name', '').strip()
    
    if not name:
        return jsonify({'error': 'No Pokémon name provided'}), 400
    
    try:
        pokemon_index = pokemon_fr_names.index(name) + 1
    except ValueError:
        print(f"Pokémon {name} non trouvé dans la liste.")
        return jsonify({'error': 'Pokémon not found'}), 404

    pokemon_url = f"https://pokeapi.co/api/v2/pokemon-species/{pokemon_index}/"
    response = requests.get(pokemon_url)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to retrieve Pokémon information'}), 500

    pokemon_data = response.json()
    french_name = next((entry['name'] for entry in pokemon_data['names'] if entry['language']['name'] == 'fr'), pokemon_data['name'])
    description = next((entry['flavor_text'] for entry in pokemon_data['flavor_text_entries'] if entry['language']['name'] == 'fr'), 'Description non disponible')
    pokemon_image = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pokemon_index}.png"

    pokemon_info = {
        'name': french_name,
        'description': description,
        'image': pokemon_image
    }

    return jsonify(pokemon_info)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)