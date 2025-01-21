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
    return render_template('index.html')

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify([])
    suggestions = [name for name in pokemon_fr_names if name.lower().startswith(query)]
    return jsonify(suggestions[:5])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)