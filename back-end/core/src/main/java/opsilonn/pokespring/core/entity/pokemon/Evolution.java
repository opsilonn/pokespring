package opsilonn.pokespring.core.entity.pokemon;

import javax.persistence.Column;
import javax.persistence.Transient;


/**
 * Entity representing an Evolution
 */
public class Evolution {
    // FIELDS
    @Column()
    private Long pokemon_pokedexNumber;

    @Transient
    private Pokemon pokemon;


    @Column()
    private Long evolution_pokedexNumber;

    @Transient
    private Pokemon evolution;



    // CONSTRUCTORS

    public Evolution() {
    }
    public Evolution(Long pokemon_id, Pokemon pokemon, Long evolution_id, Pokemon evolution) {
        this.pokemon_pokedexNumber = pokemon_id;
        this.pokemon = pokemon;
        this.evolution_pokedexNumber = evolution_id;
        this.evolution = evolution;
    }


    // GETTERS & SETTERS

    public Long getPokemon_pokedexNumber() { return pokemon_pokedexNumber; }
    public void setPokemon_pokedexNumber(Long pokemon_pokedexNumber) { this.pokemon_pokedexNumber = pokemon_pokedexNumber; }

    public Pokemon getPokemon() { return pokemon; }
    public void setPokemon(Pokemon pokemon) { this.pokemon = pokemon; }

    public Long getEvolution_pokedexNumber() { return evolution_pokedexNumber; }
    public void setEvolution_pokedexNumber(Long evolution_pokedexNumber) { this.evolution_pokedexNumber = evolution_pokedexNumber; }

    public Pokemon getEvolution() { return evolution; }
    public void setEvolution(Pokemon evolution) { this.evolution = evolution; }
}
