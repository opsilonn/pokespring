package opsilonn.pokespring.core.entity.account;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


/**
 * Entity representing an Account
 */
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class Account {
    // FIELDS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long id;

    @Column()
    private String username;

    @Column()
    private String email;

    @Column()
    private String password;

    @OneToMany(mappedBy="account")
    private List<Team> teams = new ArrayList<>();



    // CONSTRUCTORS

    /**
     * Default constructor of the class Account
     */
    public Account() {
    }
    /**
     * Semi-complete constructor of the class Account
     * @param id
     * @param username
     * @param email
     * @param password
     */
    public Account(Long id, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        teams = new ArrayList<>();
    }
    /**
     * Complete constructor of the class Account
     * @param id
     * @param username
     * @param email
     * @param password
     * @param teams
     */
    public Account(Long id, String username, String email, String password, List<Team> teams) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.teams = teams;
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String pseudonym) { this.username = pseudonym; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Team> getTeams() { return teams; }
    public void setTeams(List<Team> teams) { this.teams = teams; }
}