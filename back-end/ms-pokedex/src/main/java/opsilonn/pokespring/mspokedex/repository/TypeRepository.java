package opsilonn.pokespring.mspokedex.repository;

import opsilonn.pokespring.core.entity.pokemon.Type;
import org.springframework.data.repository.CrudRepository;


/**
 * Repository for the Entity Type
 */
public interface TypeRepository extends CrudRepository<Type, Long> {
}

