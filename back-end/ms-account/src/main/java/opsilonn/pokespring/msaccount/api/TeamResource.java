package opsilonn.pokespring.msaccount.api;

import opsilonn.pokespring.core.entity.account.Team;
import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import opsilonn.pokespring.msaccount.DTO.TeamDTO;
import opsilonn.pokespring.msaccount.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;


/**
 * Resources for the Entity Team
 */
@RestController
@RequestMapping("team")
public class TeamResource {
    @Autowired
    private TeamRepository teamRepository;


    @Autowired
    private RestTemplate restTemplate;

    /**
     * Get a Team by id
     * @param id Identifier of the Team
     * @return a Team given its identifier
     */
    @GetMapping("/{id}")
    public TeamDTO get(@PathVariable("id") Long id) {
        // We get the Team
        Team team = teamRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // For each PokemonInstance, we set the Pokemon
        team.getMembers().forEach(pokemonInstance -> {
            // We fetch the Customer
            System.out.println(pokemonInstance.getSurname() + " - " + pokemonInstance.getPokemon_id());
            pokemonInstance.setPokemon(
                    restTemplate.getForObject(
                            "http://localhost:80/pokemon/" + pokemonInstance.getPokemon_id(),
                            Pokemon.class)
            );
        });

        // We return the Team's DTO
        return new TeamDTO(team);


        /*
        // We get the Team
        Team team = teamRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // We return the Team DTO
        return new TeamDTO(team);
         */
    }


    public TeamRepository getTeamRepository() { return teamRepository; }
    public void setTeamRepository(TeamRepository teamRepository) { this.teamRepository = teamRepository; }

    public RestTemplate getRestTemplate() { return restTemplate; }
    public void setRestTemplate(RestTemplate restTemplate) { this.restTemplate = restTemplate; }
}