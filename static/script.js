const changeGame = document.getElementById('game-image');

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const pokemonInfoDiv = document.getElementById('pokemon-info');
    const pokemonNameElement = document.getElementById('pokemon-name');
    const pokemonImageElement = document.getElementById('pokemon-image');
    const suggestionsList = document.getElementById('suggestions');
    const pokemonRightDiv = document.querySelector('.pokemon-right');
    let randomPokemon = null;

    // =====================

    function getRandomPokemon() {
        const randomId = Math.floor(Math.random() * 898) + 1;
        
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}/`)
            .then(response => response.json())
            .then(data => {
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}/`)
                    .then(response => response.json())
                    .then(speciesData => {
                        const frenchNameEntry = speciesData.names.find(nameEntry => nameEntry.language.name === 'fr');
                        const frenchName = frenchNameEntry ? frenchNameEntry.name : data.name;
                        const generation = speciesData.generation.name.replace('generation-', 'Gen ').toUpperCase();
                        randomPokemon = {
                            id: randomId,
                            name: frenchName.toLowerCase(),
                            types: data.types.length === 1 ? [data.types[0].type.name, "Aucun"] : data.types.map(type => type.type.name),
                            height: data.height / 10,
                            weight: data.weight / 10,
                            generation: generation,
                        };
                        console.log("Pokémon cible:", randomPokemon);

                    });
            });
    }    

    function showVictoryMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = "Trouvé !";
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '50%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.fontSize = '5rem';
        messageDiv.style.color = 'white';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.zIndex = '1000';
        
        document.body.appendChild(messageDiv);
    
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    function comparePokemon(userPokemon) {
        const row = document.createElement('tr');
    
        function createCell(value, isCorrect, isPartial = false) {
            const cell = document.createElement('td');
            cell.textContent = value;
    
            if (isCorrect) {
                cell.style.backgroundColor = 'green';
            } else if (isPartial) {
                cell.style.backgroundColor = 'orange';
            } else {
                cell.style.backgroundColor = 'red';
            }
            return cell;
        }
    
        const type1 = userPokemon.types[0] || "Aucun";
        const type2 = userPokemon.types[1] || "Aucun";
    
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${userPokemon.id}/`)
            .then(response => response.json())
            .then(speciesData => {
                const frenchNameEntry = speciesData.names.find(nameEntry => nameEntry.language.name === 'fr');
                const frenchName = frenchNameEntry ? frenchNameEntry.name.toLowerCase() : userPokemon.name;
                const generation = speciesData.generation.name.replace('generation-', 'Gen ').toUpperCase();
                const isNameCorrect = frenchName === randomPokemon.name;
                const isType1Correct = randomPokemon.types.includes(type1);
                const isType2Correct = randomPokemon.types.includes(type2);
                const isHeightCorrect = userPokemon.height === randomPokemon.height;
                const isWeightCorrect = userPokemon.weight === randomPokemon.weight;
                const isGenCorrect = generation === randomPokemon.generation;
                let i = "";
                if (userPokemon.id > randomPokemon.id){
                    i = '⬇';
                } else if (userPokemon.id < randomPokemon.id){
                    i = "⬆";
                }
                i = userPokemon.id + " " + i
                let h = "";
                if (userPokemon.height > randomPokemon.height){
                    h = '⬇';
                } else if (userPokemon.height < randomPokemon.height){
                    h = "⬆";
                }
                h = userPokemon.height + "m " + h
                let w = "";
                if (userPokemon.weight > randomPokemon.weight){
                    w = '⬇';
                } else if (userPokemon.weight < randomPokemon.weight){
                    w = "⬆";
                }
                w = userPokemon.weight + "kg " + w

                function romanToArabic(roman) {
                    const romanNumerals = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9 };
                    return romanNumerals[roman] || null;
                }
                
                function extractGenNumber(genString) {
                    if (!genString || typeof genString !== "string") return null;
                    const match = genString.match(/Gen (\w+)/i);
                    return match ? romanToArabic(match[1]) : null;
                }
                
                const userGen = extractGenNumber(generation);
                const targetGen = extractGenNumber(randomPokemon.generation);
                
                let g = "";
                if (userGen > targetGen) {
                    g = "⬇";
                } else if (userGen < targetGen) {
                    g = "⬆";
                }
                g = userGen + " " + g
                
                row.appendChild(createCell(i, userPokemon.id === randomPokemon.id));
                row.appendChild(createCell(frenchName, isNameCorrect));
                row.appendChild(createCell(type1, isType1Correct));    
                row.appendChild(createCell(type2, isType2Correct));    
                row.appendChild(createCell(h, isHeightCorrect));
                row.appendChild(createCell(w, isWeightCorrect)); 
                row.appendChild(createCell(g, isGenCorrect));
    
                gameTable.appendChild(row);
    
                if (isNameCorrect) {
                    showVictoryMessage();
                }
            });
    }          
    
    const newGameButton = document.getElementById('btn');
    const gameTable = document.getElementById('gameTable');

    newGameButton.addEventListener('click', function () {
        getRandomPokemon();
        clearTable();
    });

    function clearTable() {
        const rows = gameTable.getElementsByTagName('tr');
        while (rows.length > 1) {
            gameTable.deleteRow(1);
        }
    }
    // =====================

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
                    const selectedPokemonId = pokemonIndex + 1;
                        if (changeGame.src.includes('game-image1')) {
                        fetchPokemonInfoById(selectedPokemonId);
                    } else {
                        fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonId}/`)
                            .then(response => response.json())
                            .then(data => {
                                const types = data.types.map(type => type.type.name); 
                                const userPokemon = {
                                    id: selectedPokemonId,
                                    name: data.name.toLowerCase(),
                                    types: types,
                                    height: data.height / 10,
                                    weight: data.weight / 10,
                                };
                                comparePokemon(userPokemon);
                            });
                    }
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

                                if(changeGame.src.includes('game-image1')){
                                    pokemonInfoDiv.style.display = 'flex';
                                }
                            }
                        });
                }
            });
    }

    searchInput.addEventListener('change', function () {
        const query = searchInput.value.toLowerCase().trim();
        const pokemonIndex = pokemon_fr_names.findIndex(name => name.toLowerCase() === query);
        
        if (changeGame.src.includes('game-image2')) {
            if (pokemonIndex !== -1) {
                fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex + 1}/`)
                    .then(response => response.json())
                    .then(data => {
                        const userPokemon = {
                            name: data.name.toLowerCase(),
                            types: data.types.map(type => type.type.name),
                            height: data.height / 10,
                            weight: data.weight / 10
                        };
                        comparePokemon(userPokemon);
                    });
                }
            }
    });

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

    const gameDiv = document.getElementById('game');
    const title1 = document.getElementById('page-title');
    const title2 = document.getElementById('page-title2');
    const search = document.getElementById('search');

    changeGame.onclick = function () {
        let id = 0;
        let src = changeGame.src;
        if (src.includes('game-image1')) {
            id = 1;
        } else if (src.includes('game-image2')) {
            id = 2;
        }
        if (id == 1) {
            changeGame.src = "/static/game-image2.png";
            id = 2;

            pokemonInfoDiv.style.display = 'none';
            title1.style.display = 'none';
            gameDiv.style.display = 'block';
            title2.style.display = 'block';
            search.value = '';
            search.placeholder = 'Guess a Pokémon';
            getRandomPokemon();
        } else {
            changeGame.src = "/static/game-image1.png";
            id = 1;

            title1.style.display = 'block';
            title2.style.display = 'none';
            gameDiv.style.display = 'none';
            search.value = '';
            search.placeholder = 'Search for a Pokémon';
            clearTable();
        }
    };
});