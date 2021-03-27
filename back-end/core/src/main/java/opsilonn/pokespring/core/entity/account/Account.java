package opsilonn.pokespring.core.entity.account;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
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

    @Column(unique=true)
    private String username;

    @Column(unique=true)
    private String email;

    @Column()
    private String password;

    @Column()
    private String pathImage;

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
     * @param pathImage
     */
    public Account(Long id, String username, String email, String password, String pathImage) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.pathImage = pathImage;
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
    public Account(Long id, String username, String email, String password, String pathImage, List<Team> teams) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.pathImage = pathImage;
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

    public String getPathImage() { return pathImage; }
    public void setPathImage(String pathImage) { this.pathImage = pathImage; }

    public List<Team> getTeams() { return teams; }
    public void setTeams(List<Team> teams) { this.teams = teams; }
}