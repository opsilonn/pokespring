package opsilonn.pokespring.core.entity.pokemon;

import javax.persistence.*;


/**
 * Entity representing a Pokemon
 */
@Entity
public class Pokemon {
    // FIELDS
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column()
    private Long id;

    @Column(name="pokedex_number")
    private Long pokedexNumber;

    @Column(name="name_english")
    private String nameEnglish;

    @Column(name="name_german")
    private String nameGerman;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name="FK_type1_id")
    private Type type1;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, optional = true)
    @JoinColumn(name="FK_type2_id")
    private Type type2;


    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name="FK_generation_id")
    private Generation generation;

    @Enumerated(EnumType.STRING)
    private Rarity rarity;

    @Column()
    private String species;

    @Column()
    private Float height;

    @Column()
    private Float weight;

    @Column()
    private Long hp;

    @Column()
    private Long attack;

    @Column()
    private Long defense;

    @Column(name="sp_attack")
    private Long specialAttack;

    @Column(name="sp_defense")
    private Long specialDefense;

    @Column()
    private Long speed;

    @Column(name="catch_rate")
    private Long catchRate;

    @Column(name="base_friendship")
    private Long baseFriendship;

    @Column(name="base_experience")
    private Long baseExperience;

    @Column(name="growth_rate")
    private String growthRate;

    @Column(name="percentage_male")
    private Float percentageMale;


    // CONSTRUCTORS

    /**
     * Default constructor of the class Pokemon
     */
    public Pokemon() {
    }

    /**
     * Complete constructor of the class Pokemon
     * @param id
     * @param pokedexNumber
     * @param nameEnglish
     * @param nameGerman
     * @param type1
     * @param type2
     * @param generation
     * @param rarity
     * @param species
     * @param hp
     * @param height
     * @param weight
     * @param attack
     * @param defense
     * @param specialAttack
     * @param specialDefense
     * @param speed
     * @param catchRate
     * @param baseFriendship
     * @param baseExperience
     * @param growthRate
     * @param percentageMale
     */
    public Pokemon(Long id, Long pokedexNumber, String nameEnglish, String nameGerman, Type type1, Type type2, Generation generation, Rarity rarity, String species, Float height, Float weight, Long hp, Long attack, Long defense, Long specialAttack, Long specialDefense, Long speed, Long catchRate, Long baseFriendship, Long baseExperience, String growthRate, Float percentageMale) {
        this.id = id;
        this.pokedexNumber = pokedexNumber;
        this.nameEnglish = nameEnglish;
        this.nameGerman = nameGerman;
        this.type1 = type1;
        this.type2 = type2;
        this.generation = generation;
        this.rarity = rarity;
        this.species = species;
        this.height = height;
        this.weight = weight;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.speed = speed;
        this.catchRate = catchRate;
        this.baseFriendship = baseFriendship;
        this.baseExperience = baseExperience;
        this.growthRate = growthRate;
        this.percentageMale = percentageMale;
    }


    // GETTERS & SETTERS

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPokedexNumber() { return pokedexNumber; }
    public void setPokedexNumber(Long pokedexNumber) { this.pokedexNumber = pokedexNumber; }

    public String getNameEnglish() { return nameEnglish; }
    public void setNameEnglish(String nameEnglish) { this.nameEnglish = nameEnglish; }

    public String getNameGerman() { return nameGerman; }
    public void setNameGerman(String nameGerman) { this.nameGerman = nameGerman; }

    public Type getType1() { return type1; }
    public void setType1(Type type1) { this.type1 = type1; }

    public Type getType2() { return type2; }
    public void setType2(Type type2) { this.type2 = type2; }

    public Generation getGeneration() { return generation; }
    public void setGeneration(Generation generation) { this.generation = generation; }

    public Rarity getRarity() { return rarity; }
    public void setRarity(Rarity rarity) { this.rarity = rarity; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public Float getHeight() { return height; }
    public void setHeight(Float height) { this.height = height; }

    public Float getWeight() { return weight; }
    public void setWeight(Float weight) { this.weight = weight; }

    public Long getHp() { return hp; }
    public void setHp(Long hp) { this.hp = hp; }

    public Long getAttack() { return attack; }
    public void setAttack(Long attack) { this.attack = attack; }

    public Long getDefense() { return defense; }
    public void setDefense(Long defense) { this.defense = defense; }

    public Long getSpecialAttack() { return specialAttack; }
    public void setSpecialAttack(Long specialAttack) { this.specialAttack = specialAttack; }

    public Long getSpecialDefense() { return specialDefense; }
    public void setSpecialDefense(Long specialDefense) { this.specialDefense = specialDefense; }

    public Long getSpeed() { return speed; }
    public void setSpeed(Long speed) { this.speed = speed; }

    public Long getCatchRate() { return catchRate; }
    public void setCatchRate(Long catchRate) { this.catchRate = catchRate; }

    public Long getBaseFriendship() { return baseFriendship; }
    public void setBaseFriendship(Long baseFriendship) { this.baseFriendship = baseFriendship; }

    public Long getBaseExperience() { return baseExperience; }
    public void setBaseExperience(Long baseExperience) { this.baseExperience = baseExperience; }

    public String getGrowthRate() { return growthRate; }
    public void setGrowthRate(String growthRate) { this.growthRate = growthRate; }

    public Float getPercentageMale() { return percentageMale; }
    public void setPercentageMale(Float percentageMale) { this.percentageMale = percentageMale; }
}
