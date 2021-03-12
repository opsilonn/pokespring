package opsilonn.pokespring.mspokedex.api;

import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import opsilonn.pokespring.core.entity.util.PokemonShort;
import opsilonn.pokespring.mspokedex.repository.PokemonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;


/**
 * Resources for the class PokemonShort, which contains a ligher version of the Entity Pokemon
 */
@RestController
@RequestMapping("/pokemonshort")
public class PokemonShortResource {
    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;


    /**
     * Get a PokemonShort by id
     * @param id Identifier of the PokemonShort
     * @return a PokemonShort given its identifier
     */
    @GetMapping("/{id}")
    public PokemonShort get(@PathVariable("id") Long id) {
        // We get the Pokemon
        Pokemon pokemon = pokemonRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // We return the light version
        return new PokemonShort(pokemon);
    }


    /**
     * Get a PokemonShort or a list by the pokedexNumber
     * @param pokedexNumber Identifier of the (list of) Pokemon
     * @return a (list of) Pokemon given its identifier
     */
    @GetMapping("/pokedex_number/{pokedexNumber}")
    public Iterable<PokemonShort> getByPokedexNumber(@PathVariable("pokedexNumber") Long pokedexNumber) {
        // We get all the Pokemon that have a given pokedex number
        Iterable<Pokemon> pokemonList = pokemonRepository.findPokemonListByPokedexNumber(pokedexNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        List<PokemonShort> pokemonShortList = new ArrayList<>();
        pokemonList.forEach(pokemon -> pokemonShortList.add(new PokemonShort(pokemon)));

        return pokemonShortList;
    }



    public PokemonRepository getPokemonRepository() { return pokemonRepository; }
    public void setPokemonRepository(PokemonRepository pokemonRepository) { this.pokemonRepository = pokemonRepository; }

    public WebClient.Builder getWebClientBuilder() { return webClientBuilder; }
    public void setWebClientBuilder(WebClient.Builder webClientBuilder) { this.webClientBuilder = webClientBuilder; }
}
