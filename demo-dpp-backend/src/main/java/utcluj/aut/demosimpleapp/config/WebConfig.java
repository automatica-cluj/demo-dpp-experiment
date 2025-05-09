package utcluj.aut.demosimpleapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Content-Disposition")
                .maxAge(3600);

        // Allow CORS for Swagger UI
        registry.addMapping("/v3/api-docs/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:8081") // Allow from frontend and backend itself
                .allowedMethods("GET")
                .allowedHeaders("*")
                .maxAge(3600);

        registry.addMapping("/swagger-ui/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:8081") // Allow from frontend and backend itself
                .allowedMethods("GET")
                .allowedHeaders("*")
                .maxAge(3600);
    }
}