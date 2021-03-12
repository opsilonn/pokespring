package opsilonn.pokespring.mspokedex.repository;

import opsilonn.pokespring.core.entity.pokemon.Generation;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;


/**
 * Repository for the Entity Generation
 */
public interface GenerationRepository extends CrudRepository<Generation, Long> {
    @Query("select g from Generation g where g.regionName = ?1")
    Optional<Generation> findByRegionName(String regionName);
}
