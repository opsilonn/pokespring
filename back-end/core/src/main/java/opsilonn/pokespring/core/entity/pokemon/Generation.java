package opsilonn.pokespring.core.entity.pokemon;

import javax.persistence.*;
import java.util.List;


/**
 * Entity representing a Generation
 */
@Entity
public class Generation {
    // FIELDS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long id;

    @Column()
    private String regionName;

    @OneToMany(mappedBy = "generation", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Pokemon> pokemonList;



    // CONSTRUCTORS

    public Generation() {
    }
    public Generation(Long id, String regionName, List<Pokemon> pokemonList) {
        this.id = id;
        this.regionName = regionName;
        this.pokemonList = pokemonList;
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegionName() { return regionName; }
    public void setRegionName(String regionName) { this.regionName = regionName; }

    public List<Pokemon> getPokemonList() { return pokemonList; }
    public void setPokemonList(List<Pokemon> pokemonList) { this.pokemonList = pokemonList; }
}
