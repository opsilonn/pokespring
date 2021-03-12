package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.PokemonInstance;
import opsilonn.pokespring.core.entity.util.PokemonShort;


/**
 * Class representing an Account, minus the field that ought to be protected
 */
public class PokemonInstanceShortDTO {
    // FIELDS
    private Long id;
    private String surname;
    private PokemonShort pokemon;


    // CONSTRUCTORS

    /**
     * Default constructor of the class PokemonInstanceShortDTO
     */
    public PokemonInstanceShortDTO() {
    }
    /**
     * Complete constructor of the class PokemonInstanceShortDTO
     * @param id
     * @param surname
     * @param pokemon
     */
    public PokemonInstanceShortDTO(Long id, String surname, PokemonShort pokemon) {
        this.id = id;
        this.surname = surname;
        this.pokemon = pokemon;
    }

    /**
     * Constructor of the class PokemonInstanceShortDTO from a PokemonInstance
     * @param pokemonInstance
     */
    public PokemonInstanceShortDTO(PokemonInstance pokemonInstance) {
        if (pokemonInstance != null) {
            id = pokemonInstance.getId();
            surname = pokemonInstance.getSurname();
            pokemon = new PokemonShort(pokemonInstance.getPokemon());
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public PokemonShort getPokemon() { return pokemon; }
    public void setPokemon(PokemonShort pokemon) { this.pokemon = pokemon; }
}