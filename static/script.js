document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const suggestionsList = document.getElementById('suggestions');

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            const response = await fetch(`/autocomplete?q=${query}`);
            const suggestions = await response.json();
            updateSuggestions(suggestions);
        } else {
            clearSuggestions();
        }
    });

    function updateSuggestions(suggestions) {
        clearSuggestions();
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', () => {
                searchInput.value = suggestion;
                clearSuggestions();
            });
            suggestionsList.appendChild(li);
        });
    }

    function clearSuggestions() {
        suggestionsList.innerHTML = '';
    }
});