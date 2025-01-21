from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

POKEMON_FR_URL = "https://raw.githubusercontent.com/sindresorhus/pokemon/main/data/fr.json"
response = requests.get(POKEMON_FR_URL)

if response.status_code == 200:
    pokemon_fr_names = response.json()
else:
    pokemon_fr_names = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '').lower()
    suggestions = [name for name in pokemon_fr_names if name.lower().startswith(query)]  # Recherche stricte au début
    suggestions_fr = suggestions[:5]
    return jsonify(suggestions_fr)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)