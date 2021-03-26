# PokeSpring Micro-Services

A test project for the use of micro-services with the [Spring Framework](https://spring.io/)


## Summary
**[PokeSpring](https://github.com/opsilonn/pokespring-micro-services#pokespring)**

[What is it ?](https://github.com/opsilonn/pokespring-micro-services#what-is-it-)

[Installation](https://github.com/opsilonn/pokespring-micro-services#installation)

[Structure](https://github.com/opsilonn/pokespring-micro-services#structure)


**[Technical round-up](https://github.com/opsilonn/pokespring-micro-services#technical-round-up)**


**[Authors](https://github.com/opsilonn/pokespring-micro-services#authors)**


**[Acknowledgments](https://github.com/opsilonn/pokespring-micro-services#acknowledgments)**




## PokeSpring

### What is it ?
blah


Here is the link to [the official website](https://www.loups-garous-en-ligne.com)


### Installation
Here is how to install the project :
```
DATABASE
Using MySql, create a database using the following script :

mysql scripts/data for ms-account.sql

BACK-END

Open any of the sub-project, and import all the other sub-projects (in Intelij, open the other pom.xml)
Download all dependencies

Launch the sub-project in the following order :
First, the service-Discovery
Second, the micro-services in any order
```


### Structure
The project is structured as follow : 
* Back-end
  * Core : Class library for the Back-end
  * Service-Discovey : Eureka Server to display the Eureka Clients (the micro-services)
  * MS-Pokedex : Micro-service for the pokemon 
* Front-end



## Technical round-up

* [Intelij IDE](https://www.jetbrains.com/idea/) - The IDE used to develop the app'
* [Spring](https://spring.io/) - Java framework to develop micro-services



## Authors

It was made by the following authors :
* **BEGEOT Hugues** - [his Git repository](https://github.com/opsilonn)

See also the list of [contributors](https://github.com/opsilonn/pokespring-micro-services/contributors) who participated in this project.


## Acknowledgments
:)
