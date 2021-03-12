package opsilonn.pokespring.msaccount.repository;

import opsilonn.pokespring.core.entity.account.PokemonInstance;
import org.springframework.data.repository.CrudRepository;


/**
 * Repository for the Entity Account
 */
public interface PokemonInstanceRepository extends CrudRepository<PokemonInstance, Long> {
}