package opsilonn.pokespring.mspokedex.api;

import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import opsilonn.pokespring.core.entity.pokemon.Type;
import opsilonn.pokespring.mspokedex.repository.PokemonRepository;
import opsilonn.pokespring.mspokedex.repository.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;


/**
 * Resources for the class Type
 */
@RestController
@RequestMapping("/type")
public class TypeResource {
    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private TypeRepository typeRepository;



    /**
     * Get all Types
     * @return all Types
     */
    @GetMapping("")
    public Iterable<Type> list() {
        // We return all the Types
        return typeRepository.findAll();
    }


    /**
     * Get a Type by id
     * @param id Identifier of the Type
     * @return a Type given its identifier
     */
    @GetMapping("/{id}")
    public Type get(@PathVariable("id") Long id) {
        // We get the Type
        Type type = typeRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        List<Pokemon> pok = pokemonRepository.findByTypeId(type.getId());
        System.out.println("SIZE : " + pok.size());

        // We get the Pokemon of the given type
        type.setPokemonList(new ArrayList<>(pok));

        // We return the Type
        return type;
    }


    /**
     * Get all Pokemon for a given Type
     * @param id Identifier of the Type
     * @return All Pokemon for a given Type
     */
    @GetMapping("/{id}/pokemon")
    public Iterable<Pokemon> getPokemonList(@PathVariable("id") Long id) {
        // We first check if the Type exists
        typeRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // If it exists, we return the Pokemon
        return pokemonRepository.findByTypeId(id);
    }


    public PokemonRepository getPokemonRepository() { return pokemonRepository; }
    public void setPokemonRepository(PokemonRepository pokemonRepository) { this.pokemonRepository = pokemonRepository; }

    public TypeRepository getTypeRepository() { return typeRepository; }
    public void setTypeRepository(TypeRepository typeRepository) { this.typeRepository = typeRepository; }
}

