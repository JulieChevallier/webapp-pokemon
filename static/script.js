document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    const pokemonNameElement = document.getElementById('pokemon-name');
    const pokemonDescriptionElement = document.getElementById('pokemon-description');
    const pokemonImageElement = document.getElementById('pokemon-image');
    const suggestionsList = document.getElementById('suggestions');

    function clearSuggestions() {
        if (suggestionsList) {
            suggestionsList.innerHTML = '';
        }
    }

    function updateSuggestions(suggestions) {
        if (!suggestionsList) return;

        clearSuggestions();

        suggestions.forEach((suggestion) => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', function() {
                searchInput.value = suggestion;
                const pokemonIndex = pokemon_fr_names.findIndex(name => name.toLowerCase() === suggestion.toLowerCase());
                if (pokemonIndex !== -1) {
                    fetchPokemonInfoById(pokemonIndex + 1);
                    clearSuggestions();
                }
            });
            suggestionsList.appendChild(li);
        });
    }

    function fetchPokemonInfoById(id) {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(response => response.json())
            .then(pokemonData => {
                if (pokemonData) {
                    const frenchName = pokemonData.names.find(nameEntry => nameEntry.language.name === 'fr');
                    const pokemonName = frenchName ? frenchName.name : pokemonData.name;
    
                    pokemonNameElement.textContent = pokemonName;
    
                    const description = pokemonData.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text || 'Description non disponible';
                    pokemonDescriptionElement.textContent = description;
    
                    const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                    pokemonImageElement.src = pokemonImageUrl;
    
                    clearAdditionalInfo();
    
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                        .then(response => response.json())
                        .then(pokemonDetails => {
                            if (pokemonDetails) {
                                const types = pokemonDetails.types.map(type => type.type.name).join(', ');
    
                                const weight = pokemonDetails.weight / 10; 
    
                                const height = pokemonDetails.height / 10;
    
                                const pokemonTypesElement = document.createElement('p');
                                pokemonTypesElement.textContent = `Type(s): ${types}`;
                                pokemonInfoDiv.appendChild(pokemonTypesElement);
    
                                const pokemonWeightElement = document.createElement('p');
                                pokemonWeightElement.textContent = `Poids: ${weight} kg`;
                                pokemonInfoDiv.appendChild(pokemonWeightElement);
    
                                const pokemonHeightElement = document.createElement('p');
                                pokemonHeightElement.textContent = `Taille: ${height} m`;
                                pokemonInfoDiv.appendChild(pokemonHeightElement);
    
                                pokemonInfoDiv.style.display = 'block';
                            }
                        });
                }
            });
    }
    function clearAdditionalInfo() {
        const infoDiv = document.getElementById('pokemon-info');
        while (infoDiv.children.length > 3) {
            infoDiv.removeChild(infoDiv.lastChild);
        }
    }

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase().trim();

        if (query) {
            fetch(`/autocomplete?q=${query}`)
                .then(response => response.json())
                .then(suggestions => {
                    updateSuggestions(suggestions);
                });
        } else {
            clearSuggestions();
        }
    });
});