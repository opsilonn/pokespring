package opsilonn.pokespring.msaccount.api;

import opsilonn.pokespring.core.entity.account.PokemonInstance;
import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import opsilonn.pokespring.msaccount.DTO.PokemonInstanceDTO;
import opsilonn.pokespring.msaccount.repository.PokemonInstanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;


/**
 * Resources for the Entity PokemonInstance
 */
@RestController
@RequestMapping("/pokemoninstance")
public class PokemonInstanceResource {
    @Autowired
    private PokemonInstanceRepository pokemonInstanceRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;


    /**
     * Get an PokemonInstance by id
     * @param id Identifier of the PokemonInstance
     * @return an PokemonInstance given its identifier
     */
    @GetMapping("/{id}")
    public PokemonInstanceDTO get(@PathVariable("id") Long id) {
        // We get the PokemonInstance
        PokemonInstance pokemonInstance = pokemonInstanceRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // We set the Web Client
        final WebClient webClient = webClientBuilder.build();

        // We get the Pokemon's details
        final Mono<Pokemon> mono = webClient
                .get().uri("http://service-pokedex/pokemon/" + pokemonInstance.getPokemon_id())
                .retrieve()
                .bodyToMono(Pokemon.class);

        final Pokemon pokemon = mono.block();

        // We set the Pokemon's details
        pokemonInstance.setPokemon(pokemon);

        // We return the PokemonInstance's DTO
        return new PokemonInstanceDTO(pokemonInstance);
    }


    public PokemonInstanceRepository getPokemonInstanceRepository() { return pokemonInstanceRepository; }
    public void setPokemonInstanceRepository(PokemonInstanceRepository pokemonInstanceRepository) { this.pokemonInstanceRepository = pokemonInstanceRepository; }
}