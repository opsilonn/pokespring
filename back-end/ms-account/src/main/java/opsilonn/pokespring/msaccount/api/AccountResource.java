package opsilonn.pokespring.msaccount.api;

import opsilonn.pokespring.core.entity.account.Account;
import opsilonn.pokespring.msaccount.DTO.AccountDTO;
import opsilonn.pokespring.msaccount.repository.AccountRepository;
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
 * Resources for the Entity Account
 */
@RestController
@RequestMapping("/account")
public class AccountResource {
    @Autowired
    private AccountRepository accountRepository;


    /**
     * Get an Account by id
     * @param id Identifier of the Account
     * @return an Account given its identifier
     */
    @GetMapping("/{id}")
    public AccountDTO get(@PathVariable("id") Long id) {
        // We return the Account
        Account account = accountRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // We return a DTO
        return new AccountDTO(account);
    }


    public AccountRepository getAccountRepository() { return accountRepository; }
    public void setAccountRepository(AccountRepository accountRepository) { this.accountRepository = accountRepository; }
}