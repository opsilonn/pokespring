package opsilonn.pokespring.mspokedex.api;


import opsilonn.pokespring.core.entity.pokemon.Generation;
import opsilonn.pokespring.mspokedex.repository.GenerationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;


/**
 * Resources for the Entity Generation
 */
@RestController
@RequestMapping("/generation")
public class GenerationResource {
    @Autowired
    private GenerationRepository generationRepository;

    @Autowired
    private WebClient.Builder webClientBuilder;


    /**
     * Gets all Generations
     * @return All Generations
     */
    @GetMapping("")
    public Iterable<Generation> list() {
        // We get all the Generations
        return generationRepository.findAll();
    }


    /**
     * Get a Generation by id
     * @param id Identifier of the Generation
     * @return a Generation given its identifier
     */
    @GetMapping("/{id}")
    public Generation get(@PathVariable("id") Long id) {
        // We get the Generation
        return generationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }


    /**
     * Get a Generation by name
     * @param regionName Name of the Generation
     * @return a Generation given its name
     */
    @GetMapping("/region_name/{regionName}")
    public Generation get(@PathVariable("regionName") String regionName) {
        // We get the Generation
        return generationRepository.findByRegionName(regionName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }


    public GenerationRepository getGenerationRepository() { return generationRepository; }
    public void setGenerationRepository(GenerationRepository generationRepository) { this.generationRepository = generationRepository; }

    public WebClient.Builder getWebClientBuilder() { return webClientBuilder; }
    public void setWebClientBuilder(WebClient.Builder webClientBuilder) { this.webClientBuilder = webClientBuilder; }
}
