document.addEventListener('DOMContentLoaded', () => {
    const apiURL = 'https://pokeapi.co/api/v2/pokemon?limit=100';
    const pokemonList = document.getElementById('pokemon-list');
    const searchBar = document.getElementById('search-bar');
    let allPokemon = [];

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            data.results.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => {
                        allPokemon.push(pokemonData);
                        displayPokemon(allPokemon);
                    })
                    .catch(error => console.error('Error fetching individual Pokémon data:', error));
            });
        })
        .catch(error => console.error('Error fetching Pokémon data:', error));

    searchBar.addEventListener('input', (e) => {
        const searchString = e.target.value.toLowerCase();
        const filteredPokemon = allPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchString)
        );
        displayPokemon(filteredPokemon);
    });

    function displayPokemon(pokemonArray) {
        pokemonList.innerHTML = '';
        pokemonArray.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('col-md-4', 'pokemon-card');
    
            pokemonCard.innerHTML = `
                <div class="card">
                    <img src="${pokemon.sprites.front_default}" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title text-center">
                            <a href="#" class="pokemon-link" data-toggle="modal" data-target="#pokemonModal" data-name="${pokemon.name}">${pokemon.name}</a>
                        </h5>
                        <p class="card-text text-center">Height: ${pokemon.height} | Weight: ${pokemon.weight}</p>
                    </div>
                </div>
            `;
    
            pokemonList.appendChild(pokemonCard);
        });

        document.querySelectorAll('.pokemon-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const pokemonName = e.target.getAttribute('data-name');
                const selectedPokemon = allPokemon.find(pokemon => pokemon.name === pokemonName);
                showPokemonDetails(selectedPokemon);
            });
        });
    }

    function showPokemonDetails(pokemon) {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="text-center">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name}</h3>
                <p>Height: ${pokemon.height} | Weight: ${pokemon.weight}</p>
                <p>Type: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                <p>Abilities: ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
            </div>
        `;
    }
});
