document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    const pokemonNameElement = document.getElementById('pokemon-name');
    const pokemonImageElement = document.getElementById('pokemon-image');
    const suggestionsList = document.getElementById('suggestions');
    const pokemonDescriptionElement = document.querySelector('.desc');
    const pokemonRightDiv = document.querySelector('.pokemon-right');

    function toggleSuggestionsVisibility() {
        if (suggestionsList.children.length > 0) {
            suggestionsList.style.display = 'block';
        } else {
            suggestionsList.style.display = 'none';
        }
    }

    function clearSuggestions() {
        if (suggestionsList) {
            suggestionsList.innerHTML = '';
        }
        toggleSuggestionsVisibility();
    }

    function clearRightPanel() {
        while (pokemonRightDiv.children.length > 0) {
            pokemonRightDiv.removeChild(pokemonRightDiv.lastChild);
        }
    }

    function updateSuggestions(suggestions) {
        clearSuggestions();

        suggestions.forEach((suggestion) => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', function () {
                searchInput.value = suggestion;
                const pokemonIndex = pokemon_fr_names.findIndex(name => name.toLowerCase() === suggestion.toLowerCase());
                if (pokemonIndex !== -1) {
                    fetchPokemonInfoById(pokemonIndex + 1);
                    clearSuggestions();
                }
            });
            suggestionsList.appendChild(li);
        });
        toggleSuggestionsVisibility();
    }

    function fetchPokemonInfoById(id) {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`)
            .then(response => response.json())
            .then(pokemonData => {
                if (pokemonData) {
                    const frenchName = pokemonData.names.find(nameEntry => nameEntry.language.name === 'fr');
                    const pokemonName = frenchName ? frenchName.name : pokemonData.name;

                    const description = pokemonData.flavor_text_entries.find(entry => entry.language.name === 'fr')?.flavor_text || 'Description non disponible';

                    const pokemonImageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

                    pokemonNameElement.textContent = pokemonName;
                    pokemonImageElement.src = pokemonImageUrl;

                    clearRightPanel();

                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
                        .then(response => response.json())
                        .then(pokemonDetails => {
                            if (pokemonDetails) {
                                const types = pokemonDetails.types.map(type => type.type.name).join(', ');
                                const weight = pokemonDetails.weight / 10;
                                const height = pokemonDetails.height / 10;

                                const infoLines = [
                                    { label: 'Nom:', value: pokemonName },
                                    { label: 'N° Pokédex:', value: id },
                                    { label: 'Type(s):', value: types },
                                    { label: 'Poids:', value: `${weight} kg` },
                                    { label: 'Taille:', value: `${height} m` }
                                ];

                                infoLines.forEach(info => {
                                    const infoDiv = document.createElement('div');
                                    infoDiv.classList.add('info-line');
                                    const strong = document.createElement('strong');
                                    strong.textContent = info.label;
                                    const value = document.createElement('p');
                                    value.textContent = info.value;
                                    infoDiv.appendChild(strong);
                                    infoDiv.appendChild(value);
                                    pokemonRightDiv.appendChild(infoDiv);
                                });

                                const descriptionDiv = document.createElement('div');
                                descriptionDiv.classList.add('info-line');
                                const descriptionTitle = document.createElement('strong');
                                descriptionTitle.textContent = 'Description:';
                                descriptionDiv.appendChild(descriptionTitle);
                                pokemonRightDiv.appendChild(descriptionDiv);

                                const descElement = document.createElement('p');
                                descElement.classList.add('desc');
                                descElement.textContent = description;
                                pokemonRightDiv.appendChild(descElement);

                                pokemonInfoDiv.style.display = 'flex';
                            }
                        });
                }
            });
    }

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase().trim();

        if (query) {
            fetch(`/autocomplete?q=${query}`)
                .then(response => response.json())
                .then(suggestions => {
                    updateSuggestions(suggestions);
                })
                .catch(() => {
                    clearSuggestions();
                });
        } else {
            clearSuggestions();
        }
    });
});