package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.Team;
import java.util.ArrayList;
import java.util.List;


/**
 * Class representing a Team, minus the field that ought to be protected
 */
public class TeamDTO {
    // FIELDS
    private Long id;
    private String name;
    private AccountShortDTO account;
    private List<PokemonInstanceDTO> members = new ArrayList<>();


    // CONSTRUCTORS

    /**
     * Default constructor of the class TeamDTO
     */
    public TeamDTO() {
    }
    /**
     * Complete constructor of the class TeamDTO
     * @param id
     * @param name
     * @param account
     * @param members
     */
    public TeamDTO(Long id, String name, AccountShortDTO account, List<PokemonInstanceDTO> members) {
        this.id = id;
        this.name = name;
        this.account = account;
        this.members = members;
    }

    /**
     * Constructor of the class TeamDTO from a Team
     * @param team
     */
    public TeamDTO(Team team) {
        if (team != null) {
            id = team.getId();
            name = team.getName();
            account = new AccountShortDTO(team.getAccount());

            members = new ArrayList<>();
            if (team.getMembers() != null) {
                team.getMembers().forEach(pokemonInstance -> members.add(new PokemonInstanceDTO(pokemonInstance)));
            }
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AccountShortDTO getAccount() { return account; }
    public void setAccount(AccountShortDTO account) { this.account = account; }

    public List<PokemonInstanceDTO> getMembers() { return members; }
    public void setMembers(List<PokemonInstanceDTO> members) { this.members = members; }
}