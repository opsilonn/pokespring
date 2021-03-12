package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.Account;

import java.util.ArrayList;
import java.util.List;


/**
 * Class representing an Account, minus the field that ought to be protected
 */
public class AccountShortDTO {
    // FIELDS
    private Long id;
    private String username;


    // CONSTRUCTORS

    /**
     * Default constructor of the class AccountShortDTO
     */
    public AccountShortDTO() {
    }
    /**
     * Complete constructor of the class AccountShortDTO
     * @param id
     * @param username
     */
    public AccountShortDTO(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    /**
     * Constructor of the class AccountShortDTO from an Account
     * @param account
     */
    public AccountShortDTO(Account account) {
        if (account != null) {
            id = account.getId();
            username = account.getUsername();
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}