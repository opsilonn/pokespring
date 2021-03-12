package opsilonn.pokespring.mspokedex.repository;

import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;


/**
 * Repository for the Entity Pokemon
 */
public interface PokemonRepository extends CrudRepository<Pokemon, Long> {
    @Query("select p from Pokemon p where p.pokedexNumber = ?1")
    Optional<Iterable<Pokemon>> findPokemonListByPokedexNumber(Long pokedexNumber);

    @Query("select p from Pokemon p where p.generation.id = ?1")
    List<Pokemon> findByGenerationId(Long generationId);

    @Query("select p from Pokemon p where p.type1.id = ?1")
    List<Pokemon> findByTypeId(Long typeId);
}
