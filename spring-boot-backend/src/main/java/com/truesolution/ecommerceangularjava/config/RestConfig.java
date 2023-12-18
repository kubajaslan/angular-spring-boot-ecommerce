package com.truesolution.ecommerceangularjava.config;

import com.truesolution.ecommerceangularjava.entity.Country;
import com.truesolution.ecommerceangularjava.entity.Product;
import com.truesolution.ecommerceangularjava.entity.ProductCategory;
import com.truesolution.ecommerceangularjava.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class RestConfig implements RepositoryRestConfigurer {
    private EntityManager entityManager;
    @Autowired
    public RestConfig(EntityManager _entityManager) {
        entityManager = _entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        disableHttpMethods(config, unsupportedActions, Product.class);
        disableHttpMethods(config, unsupportedActions, ProductCategory.class);
        disableHttpMethods(config, unsupportedActions, Country.class);
        disableHttpMethods(config, unsupportedActions, State.class);


        exposeIds(config);
    }

    private static void disableHttpMethods(RepositoryRestConfiguration config, HttpMethod[] unsupportedActions, Class domainType) {
        config.getExposureConfiguration().forDomainType(domainType)
              .withItemExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)))
              .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(unsupportedActions)));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
         Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

         List<Class> entityClasses = new ArrayList<>();

         for (EntityType entityType : entities) {
             entityClasses.add(entityType.getJavaType());
         }

         Class[] domainTypes = entityClasses.toArray(new Class[0]);
         config.exposeIdsFor(domainTypes);
    }
}
