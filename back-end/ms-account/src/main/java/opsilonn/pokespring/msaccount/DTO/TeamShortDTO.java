package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.Team;


/**
 * Class representing a condensed view of a Team, minus the field that ought to be protected
 */
public class TeamShortDTO {
    // FIELDS
    private Long id;
    private String name;
    private AccountShortDTO account;


    // CONSTRUCTORS

    /**
     * Default constructor of the class TeamShortDTO
     */
    public TeamShortDTO() {
    }
    /**
     * Complete constructor of the class TeamShortDTO
     * @param id
     * @param name
     * @param account
     */
    public TeamShortDTO(Long id, String name, AccountShortDTO account) {
        this.id = id;
        this.name = name;
        this.account = account;
    }

    /**
     * Constructor of the class TeamShortDTO from a Team
     * @param team
     */
    public TeamShortDTO(Team team) {
        if (team != null) {
            id = team.getId();
            name = team.getName();
            account = new AccountShortDTO(team.getAccount());
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AccountShortDTO getAccount() { return account; }
    public void setAccount(AccountShortDTO account) { this.account = account; }
}
