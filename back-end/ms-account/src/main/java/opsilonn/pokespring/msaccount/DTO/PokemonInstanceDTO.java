package opsilonn.pokespring.msaccount.DTO;

import opsilonn.pokespring.core.entity.account.PokemonInstance;
import opsilonn.pokespring.core.entity.pokemon.Pokemon;


/**
 * Class representing an Account, minus the field that ought to be protected
 */
public class PokemonInstanceDTO {
    // FIELDS
    private Long id;
    private String surname;
    private Pokemon pokemon;
    private TeamShortDTO team;


    // CONSTRUCTORS

    /**
     * Default constructor of the class PokemonInstanceDTO
     */
    public PokemonInstanceDTO() {
    }
    /**
     * Complete constructor of the class PokemonInstanceDTO
     * @param id
     * @param surname
     * @param pokemon
     * @param team
     */
    public PokemonInstanceDTO(Long id, String surname, Pokemon pokemon, TeamShortDTO team) {
        this.id = id;
        this.surname = surname;
        this.pokemon = pokemon;
        this.team = team;
    }

    /**
     * Constructor of the class PokemonInstanceDTO from a PokemonInstance
     * @param pokemonInstance
     */
    public PokemonInstanceDTO(PokemonInstance pokemonInstance) {
        if (pokemonInstance != null) {
            id = pokemonInstance.getId();
            surname = pokemonInstance.getSurname();
            pokemon = pokemonInstance.getPokemon();
            team = new TeamShortDTO(pokemonInstance.getTeam());
        }
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public Pokemon getPokemon() { return pokemon; }
    public void setPokemon(Pokemon pokemon) { this.pokemon = pokemon; }

    public TeamShortDTO getTeam() { return team; }
    public void setTeam(TeamShortDTO team) { this.team = team; }
}