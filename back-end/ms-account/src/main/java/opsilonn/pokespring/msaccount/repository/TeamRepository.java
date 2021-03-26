package opsilonn.pokespring.msaccount.repository;

import opsilonn.pokespring.core.entity.account.Team;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;


/**
 * Repository for the Entity Team
 */
public interface TeamRepository extends CrudRepository<Team, Long> {
    @Query(nativeQuery = true, value = "select * from Team where fk_account_id = ?1")
    List<Team> findTeamsByAccountId(Long id);
}