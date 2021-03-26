package opsilonn.pokespring.msaccount.repository;

import opsilonn.pokespring.core.entity.account.Account;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;
import java.util.Optional;


/**
 * Repository for the Entity Account
 */
public interface AccountRepository extends CrudRepository<Account, Long> {
    @Query("select a from Account a where a.username = ?1")
    Optional<Account> findByUsername(String username);

    @Query(nativeQuery = true, value = "select * from Account where username LIKE ?1 LIMIT 0, 3")
    List<Account> findByUsernameLike(String username);

    @Query("select a from Account a where a.username = ?1 AND a.password = ?2")
    Optional<Account> login(String username, String password);
}