package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.Team;
import opsilonn.pokespring.core.entity.util.PokemonShort;

import java.util.*;


/**
 * Class representing a condensed view of a Team, minus the field that ought to be protected
 */
public class TeamShortDTO {
    // FIELDS
    private Long id;
    private String name;
    private AccountShortDTO account;
    private List<PokemonInstanceShortDTO> members = new ArrayList<>();


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
     * @param members
     */
    public TeamShortDTO(Long id, String name, AccountShortDTO account, List<PokemonInstanceShortDTO> members) {
        this.id = id;
        this.name = name;
        this.account = account;
        this.members = members;
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
            members = new ArrayList<>();
            team.getMembers().forEach(member -> members.add(new PokemonInstanceShortDTO(member)));
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AccountShortDTO getAccount() { return account; }
    public void setAccount(AccountShortDTO account) { this.account = account; }

    public List<PokemonInstanceShortDTO> getMembers() { return members; }
    public void setMembers(List<PokemonInstanceShortDTO> members) { this.members = members; }
}
