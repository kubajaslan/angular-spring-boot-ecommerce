package com.truesolution.ecommerceangularjava.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class MyAppConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry cors) {

        // set up global cors configuration
        cors.addMapping("/api/**")
            .allowedOrigins("http://localhost:4200");
    }
}
