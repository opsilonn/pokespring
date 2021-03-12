package opsilonn.pokespring.core.entity.util;

import opsilonn.pokespring.core.entity.pokemon.Pokemon;
import opsilonn.pokespring.core.entity.pokemon.Type;


public class PokemonShort {
    // FIELDS
    private Long id;
    private Long pokedexNumber;
    private String name;
    private Type type1;
    private Type type2;


    // CONSTRUCTORS

    /**
     * Default constructor of the class PokemonShort
     */
    public PokemonShort() {
    }

    /**
     * Complete constructor of the class PokemonShort
     * @param id
     * @param pokedexNumber
     * @param name
     * @param type1
     * @param type2
     */
    public PokemonShort(Long id, Long pokedexNumber, String name, Type type1, Type type2) {
        this.id = id;
        this.pokedexNumber = pokedexNumber;
        this.name = name;
        this.type1 = type1;
        this.type2 = type2;
    }

    /**
     * Constructor from a Pokemon instance
     * @param pokemon
     */
    public PokemonShort(Pokemon pokemon) {
        id = pokemon.getId();
        pokedexNumber = pokemon.getPokedexNumber();
        name = pokemon.getNameEnglish();
        type1 = pokemon.getType1();
        type2 = pokemon.getType2();
    }

    // GETTERS && SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPokedexNumber() { return pokedexNumber; }
    public void setPokedexNumber(Long pokedexNumber) { this.pokedexNumber = pokedexNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Type getType1() { return type1; }
    public void setType1(Type type1) { this.type1 = type1; }

    public Type getType2() { return type2; }
    public void setType2(Type type2) { this.type2 = type2; }
}
