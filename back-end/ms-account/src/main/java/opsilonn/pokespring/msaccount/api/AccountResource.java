package opsilonn.pokespring.msaccount.api;

import opsilonn.pokespring.core.entity.account.Account;
import opsilonn.pokespring.core.entity.account.Team;
import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import opsilonn.pokespring.msaccount.DTO.AccountDTO;
import opsilonn.pokespring.msaccount.repository.AccountRepository;
import opsilonn.pokespring.msaccount.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
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

    @Autowired
    private RestTemplate restTemplate;


    /**
     * Get an Account by id
     * @param id Identifier of the Account
     * @return an Account given its identifier
     */
    @GetMapping("/{id}")
    public AccountDTO get(@PathVariable("id") Long id) {
        // We fetch the Account
        Account account = accountRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // We iterate through the Teams
        account.getTeams().forEach(team -> {
            // We iterate through the Team's members
            team.getMembers().forEach(member -> {
                // We get the Pokemon's data

                final Pokemon pokemon = restTemplate.getForObject(
                        "http://localhost:80/pokemon/" + member.getPokemon_id(),
                        Pokemon.class);

                // We set the member's pokemon data
                member.setPokemon(pokemon);
            });
        });

        // We return a DTO
        return new AccountDTO(account);
    }


    /**
     * Get an Account by username
     * @param username Username of the Account
     * @return an Account given its username
     */
    @GetMapping("/username/{username}")
    public AccountDTO get(@PathVariable("username") String username) {
        // We fetch the Account
        Account account = accountRepository.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // We iterate through the Teams
        account.getTeams().forEach(team -> {
            // We iterate through the Team's members
            team.getMembers().forEach(member -> {
                // We get the Pokemon's data

                final Pokemon pokemon = restTemplate.getForObject(
                        "http://localhost:80/pokemon/" + member.getPokemon_id(),
                        Pokemon.class);

                // We set the member's pokemon data
                member.setPokemon(pokemon);
            });
        });

        // We return a DTO
        return new AccountDTO(account);
    }


    /**
     * Get an Account by username
     * @param username Username of the Account
     * @return an Account given its username
     */
    @GetMapping("/username/search/{username}")
    public List<AccountDTO> search(@PathVariable("username") String username) {
        // We create a list
        List<Account> accountsFound = new ArrayList<>();

        // If we have a valid username
        if (username.length() > 0) {
            // We set the pattern
            String pattern = "%" + username + "%";

            // We fetch the Accounts
            accountsFound = accountRepository.findByUsernameLike(pattern);
        }

        // We convert them to a list of DTOs
        List<AccountDTO> accounts = new ArrayList<>();
        accountsFound.forEach(account -> accounts.add(new AccountDTO(account)));

        // We return a list of DTO
        return accounts;
    }

    /**
     * Endpoint to try to login (just checking the credentials, so stocking who's logged and with which token)
     * @param accountReceived Account containing the data to log in
     * @return The account with the data of the logged user (if any ; otherwise an error is raised)
     */
    @PostMapping("/login")
    @ResponseBody
    public AccountDTO login (@RequestBody Account accountReceived) {
        // We try to login
        Account accountFound = accountRepository.login(accountReceived.getUsername(), accountReceived.getPassword()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));

        // We return the logged-in account
        return new AccountDTO(accountFound);
    }


    /**
     * Endpoint to try to create an Account
     * @param accountReceived Account containing the data for the new Account
     * @return The Account with the data of the new user (if successful ; otherwise, an error is raised)
     */
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

    public RestTemplate getRestTemplate() { return restTemplate; }
    public void setRestTemplate(RestTemplate restTemplate) { this.restTemplate = restTemplate; }
}