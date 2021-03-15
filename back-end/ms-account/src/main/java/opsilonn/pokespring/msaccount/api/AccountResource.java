package opsilonn.pokespring.msaccount.api;

import opsilonn.pokespring.core.entity.account.Account;
import opsilonn.pokespring.msaccount.DTO.AccountDTO;
import opsilonn.pokespring.msaccount.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.sql.SQLException;
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

    @PostMapping("/login")
    @ResponseBody
    public AccountDTO login (@RequestBody Account accountReceived) {
        // We try to login
        Account accountFound = accountRepository.login(accountReceived.getUsername(), accountReceived.getPassword()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        // We return the logged-in account
        return new AccountDTO(accountFound);
    }


    @PostMapping
    @ResponseBody
    public AccountDTO insert (@RequestBody Account accountReceived) {
        // We initialize an account
        Account accountSaved = new Account();

        try {
            // We try to save the account
            accountSaved = accountRepository.save(accountReceived);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.EXPECTATION_FAILED);
        }

        // If reached, we return the created Account
        return new AccountDTO(accountSaved);
    }


    public AccountRepository getAccountRepository() { return accountRepository; }
    public void setAccountRepository(AccountRepository accountRepository) { this.accountRepository = accountRepository; }
}