package opsilonn.pokespring.core.entity.account;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


/**
 * Entity representing a Team
 */
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Team {
    // FIELDS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long id;

    @Column()
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name="fk_account_id")
    private Account account;

    @OneToMany(mappedBy="team")
    private List<PokemonInstance> members = new ArrayList<>();


    // CONSTRUCTORS

    /**
     * Default constructor of the class Team
     */
    public Team() {
    }

    /**
     * Complete constructor of the class Team
     * @param id
     * @param name
     * @param account
     * @param members
     */
    public Team(Long id, String name, Account account, List<PokemonInstance> members) {
        this.id = id;
        this.name = name;
        this.account = account;
        this.members = members;
    }

    // GETTERS & SETTERS
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public List<PokemonInstance> getMembers() { return members; }
    public void setMembers(List<PokemonInstance> members) { this.members = members; }
}
