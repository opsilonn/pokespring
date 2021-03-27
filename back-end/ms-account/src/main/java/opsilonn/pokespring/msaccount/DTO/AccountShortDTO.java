package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.Account;


/**
 * Class representing an Account, minus the field that ought to be protected
 */
public class AccountShortDTO {
    // FIELDS
    private Long id;
    private String username;
    private String pathImage;


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
    public AccountShortDTO(Long id, String username, String pathImage) {
        this.id = id;
        this.username = username;
        this.pathImage = pathImage;
    }

    /**
     * Constructor of the class AccountShortDTO from an Account
     * @param account
     */
    public AccountShortDTO(Account account) {
        if (account != null) {
            id = account.getId();
            username = account.getUsername();
            pathImage = account.getPathImage();
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPathImage() { return pathImage; }
    public void setPathImage(String pathImage) { this.pathImage = pathImage; }
}