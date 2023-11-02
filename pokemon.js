var listaPokemoni = [];

$(document).ready(function() {
    // Ascunde elementele pentru căutare și butonul "Afisare random" la început
    $('#search-input').hide();
    $('#search-button').hide();
    $('#random-button').hide();
    $('.spinner').hide();
    $('#filtered-pokemon-list').hide(); // Ascunde lista filtrată inițial

    // Afișează animația Pokemon GIF timp de 3 secunde
    setTimeout(function() {
        $('#pokemon-container').fadeOut('slow', function() {
            // După ce animația s-a terminat, afișează elementele pentru căutare
            $('#search-input').fadeIn('slow');
            $('#search-button').fadeIn('slow');
        });
    }, 3000);


    $('#search-button').on('click', function() {
        var tipPokemon = $('#search-input').val().toLowerCase();
    
        if (tipPokemon.length > 0) {
            // Utilizează AJAX pentru a obține pokemonul specificat după nume
            $.ajax({
                url: 'https://pokeapi.co/api/v2/pokemon/' + tipPokemon,
                type: 'GET',
                success: function(data) {
                    console.log(data);
                    // Afișează rezultatele filtrate
                    displayFilteredPokemon([data]); // Wrap data in an array to match the expected format
                },
                error: function(error) {
                    console.log('Eroare: ' + error);
                }
            });
        } else {
            var result = confirm('Inputul este gol. Doriți să afișați Pokemoni random?');

            if (result) {
                // Implementează acțiunea pentru butonul "Afisare random"
                showRandomPokemon(2);
            }else {
                // Implementează acțiunea pentru butonul "Cancel"
                alert('Ai apăsat Cancel. Introduceți un tip de Pokemon pentru a căuta.');
            }
        }
    });
    
    // Funcție pentru afișarea listei de pokemoni filtrată
    function displayFilteredPokemon(pokemonList) {
        var pokemonContainer = $('#filtered-pokemon-list');
        pokemonContainer.empty(); // Curăță conținutul anterior
    
        if (pokemonList && Array.isArray(pokemonList)) {
            // Adaugă pokemonii noi la lista globală
            listaPokemoni = listaPokemoni.concat(pokemonList);
    
            // Parcurge lista de pokemoni și afișează fiecare element într-un container dreptunghiular
            listaPokemoni.forEach(function(pokemon) {
                var pokemonDiv = $('<div class="pokemon-card",></div>');
                pokemonDiv.append('<p>Name: ' + pokemon.name + '</p>');
                // Type information is in pokemon.types array. Assuming you want the first type.
                pokemonDiv.append('<p>Type: ' + pokemon.types[0].type.name + '</p>');
                pokemonDiv.append('<p>ID: ' + pokemon.id + '</p>');
                pokemonDiv.append('<img src="' + pokemon.sprites.front_default + '" alt="' + pokemon.name + '">');
                pokemonContainer.append(pokemonDiv);
            });
        } else {
            // Afișează un mesaj în cazul în care lista de pokemoni este goală sau undefined
            pokemonContainer.append('<p>Nu s-au găsit pokemoni pentru acest nume.</p>');
        }
    
        pokemonContainer.show(); // Afișează lista filtrată
    }

    function showRandomPokemon(count) {
        // Numărul total de pokemoni disponibili (până la ID-ul 898)
        var totalPokemonCount = 898;
    
        var randomPokemonIDs = [];
        // Generează ID-uri aleatorii pentru numărul specificat de pokemoni
        for (var i = 0; i < count; i++) {
            var randomID = Math.floor(Math.random() * totalPokemonCount) + 1; // Adaugă 1 pentru a începe de la ID-ul 1
            randomPokemonIDs.push(randomID);
        }
    
        var filteredPokemonList = [];
        // Face cereri pentru detalii despre pokemoni cu ID-urile generate aleatoriu
        randomPokemonIDs.forEach(function (pokemonID) {
            $.ajax({
                url: 'https://pokeapi.co/api/v2/pokemon/' + pokemonID,
                type: 'GET',
                success: function (pokemonData) {
                    filteredPokemonList.push(pokemonData);
                    // Verifică dacă toate cererile au fost finalizate și afișează lista
                    if (filteredPokemonList.length === count) {
                        // Afișează rezultatele filtrate
                        displayFilteredPokemon(filteredPokemonList);
                    }
                },
                error: function (error) {
                    console.log('Eroare: ' + error);
                }
            });
        });
    }
    
    
});
