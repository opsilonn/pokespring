package opsilonn.pokespring.msaccount;

import com.fasterxml.jackson.datatype.hibernate5.Hibernate5Module;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;


@SpringBootApplication
@EntityScan("opsilonn.pokespring.core.entity.account")
public class MsAccountApplication {
	public static void main(String[] args) {
		SpringApplication.run(MsAccountApplication.class, args);
	}

	/*
	@Bean
	public Hibernate5Module datatypeHibernateModule() {
		// We create a module
		Hibernate5Module module = new Hibernate5Module();

		// We disable the transient annotation
		module.disable(Hibernate5Module.Feature.USE_TRANSIENT_ANNOTATION);

		// We enable the serialization of the id of not loaded objects
		module.enable(Hibernate5Module.Feature.SERIALIZE_IDENTIFIER_FOR_LAZY_NOT_LOADED_OBJECTS);

		// We return the module
		return module;
	}
	*/


	// Synchronous
	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	// Asynchronous
	@Bean
	@LoadBalanced
	public WebClient.Builder getWebClientBuilder() {
		return WebClient.builder();
	}
}
