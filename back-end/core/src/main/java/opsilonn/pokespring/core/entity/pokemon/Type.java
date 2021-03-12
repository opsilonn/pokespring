package opsilonn.pokespring.core.entity.pokemon;

import com.fasterxml.jackson.annotation.JsonBackReference;
import javax.persistence.*;
import java.util.List;


/**
 * Entity representing a Type
 */
@Entity
public class Type {
    // FIELDS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long id;

    @Column()
    private String name;

    @Transient
    private List<Pokemon> pokemonList;


    // CONSTRUCTORS
    /**
     * Default constructor of the class Type
     */
    public Type() {
    }
    /**
     * Complete constructor of the class Type
     * @param id
     * @param name
     * @param pokemonList
     */
    public Type(Long id, String name, List<Pokemon> pokemonList) {
        this.id = id;
        this.name = name;
        this.pokemonList = pokemonList;
    }



    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Pokemon> getPokemonList() { return pokemonList; }
    public void setPokemonList(List<Pokemon> pokemonList) { this.pokemonList = pokemonList; }
}
