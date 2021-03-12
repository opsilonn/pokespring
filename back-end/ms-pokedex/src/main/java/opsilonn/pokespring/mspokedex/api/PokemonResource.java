package opsilonn.pokespring.mspokedex.api;


import opsilonn.pokespring.mspokedex.repository.PokemonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import opsilonn.pokespring.core.entity.pokemon.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;


/**
 * Resources for the Entity Pokemon
 */
@RestController
@RequestMapping("/pokemon")
public class PokemonResource {
    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;


    /**
     * Gets all Pokemon
     * @return All Pokemon
     */
    @GetMapping("")
    public Iterable<Pokemon> list() {
        // We get all the Pokemon
        return pokemonRepository.findAll();
    }


    /**
     * Get a Pokemon by id
     * @param id Identifier of the Pokemon
     * @return a Pokemon given its identifier
     */
    @GetMapping("/{id}")
    public Pokemon get(@PathVariable("id") Long id) {
        // We get the Pokemon
        return pokemonRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }


    /**
     * Get a Pokemon or a list by the pokedexNumber
     * @param pokedexNumber Identifier of the (list of) Pokemon
     * @return a (list of) Pokemon given its identifier
     */
    @GetMapping("/pokedex_number/{pokedexNumber}")
    public Iterable<Pokemon> getByPokedexNumber(@PathVariable("pokedexNumber") Long pokedexNumber) {
        // We get all the Pokemon that have a given pokedex number
        return pokemonRepository.findPokemonListByPokedexNumber(pokedexNumber).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }



    public PokemonRepository getPokemonRepository() { return pokemonRepository; }
    public void setPokemonRepository(PokemonRepository pokemonRepository) { this.pokemonRepository = pokemonRepository; }

    public WebClient.Builder getWebClientBuilder() { return webClientBuilder; }
    public void setWebClientBuilder(WebClient.Builder webClientBuilder) { this.webClientBuilder = webClientBuilder; }
}
