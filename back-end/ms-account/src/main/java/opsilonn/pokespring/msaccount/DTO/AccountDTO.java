package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.Account;
import java.util.ArrayList;
import java.util.List;


/**
 * Class representing an Account, minus the field that ought to be protected
 */
public class AccountDTO {
    // FIELDS
    private Long id;
    private String username;
    private String email;
    private String pathImage;
    private List<TeamShortDTO> teams;


    // CONSTRUCTORS

    /**
     * Default constructor of the class AccountDTO
     */
    public AccountDTO() {
    }
    /**
     * Complete constructor of the class AccountDTO
     * @param id
     * @param username
     * @param email
     * @param pathImage
     * @param teams
     */
    public AccountDTO(Long id, String username, String email, String pathImage, List<TeamShortDTO> teams) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.pathImage = pathImage;
        this.teams = teams;
    }

    /**
     * Constructor of the class AccountDTO from an Account
     * @param account
     */
    public AccountDTO(Account account) {
        if (account != null) {
            id = account.getId();
            username = account.getUsername();
            email = account.getEmail();
            pathImage = account.getPathImage();

            teams = new ArrayList<>();
            account.getTeams().forEach(team -> teams.add(new TeamShortDTO(team)));
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPathImage() { return pathImage; }
    public void setPathImage(String pathImage) { this.pathImage = pathImage; }

    public List<TeamShortDTO> getTeams() { return teams; }
    public void setTeams(List<TeamShortDTO> teams) { this.teams = teams; }
}