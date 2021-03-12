package opsilonn.pokespring.msaccount.repository;

import opsilonn.pokespring.core.entity.account.Team;
import org.springframework.data.repository.CrudRepository;


/**
 * Repository for the Entity Team
 */
public interface TeamRepository extends CrudRepository<Team, Long> {
}