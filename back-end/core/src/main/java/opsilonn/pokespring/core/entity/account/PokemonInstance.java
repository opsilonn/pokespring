package opsilonn.pokespring.core.entity.account;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import javax.persistence.*;


/**
 * Entity representing a PokemonInstance
 */
@Entity
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id")
public class PokemonInstance {
    // FIELDS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long id;

    @Column()
    private String surname;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name="fk_team_id")
    private Team team;

    @Transient
    private Pokemon pokemon;

    @Column(name="fk_pokemon_id")
    private Long pokemon_id;


    // CONSTRUCTORS

    /**
     * Default constructor of the class PokemonInstance
     */
    public PokemonInstance() {
    }

    /**
     * Complete constructor of the class PokemonInstance
     * @param id
     * @param surname
     * @param team
     * @param pokemon
     * @param pokemon_id
     */
    public PokemonInstance(Long id, String surname, Team team, Pokemon pokemon, Long pokemon_id) {
        this.id = id;
        this.surname = surname;
        this.team = team;
        this.pokemon = pokemon;
        this.pokemon_id = pokemon_id;
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }

    public Pokemon getPokemon() { return pokemon; }
    public void setPokemon(Pokemon pokemon) { this.pokemon = pokemon; }

    public Long getPokemon_id() { return pokemon_id; }
    public void setPokemon_id(Long pokemon_id) { this.pokemon_id = pokemon_id; }
}
