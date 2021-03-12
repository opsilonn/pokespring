package opsilonn.pokespring.msaccount.repository;

import opsilonn.pokespring.core.entity.account.Account;
import org.springframework.data.repository.CrudRepository;


/**
 * Repository for the Entity Account
 */
public interface AccountRepository extends CrudRepository<Account, Long> {
}