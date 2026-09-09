package com.silverhand.customer;

import com.silverhand.customer.config.AsyncSyncConfiguration;
import com.silverhand.customer.config.DatabaseTestcontainer;
import com.silverhand.customer.config.ElasticsearchTestConfiguration;
import com.silverhand.customer.config.ElasticsearchTestContainer;
import com.silverhand.customer.config.RedisTestContainer;
import com.silverhand.customer.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        CustomerApp.class,
        AsyncSyncConfiguration.class,
        TestSecurityConfiguration.class,
        com.silverhand.customer.config.JacksonHibernateConfiguration.class,
        DatabaseTestcontainer.class,
        ElasticsearchTestContainer.class,
        ElasticsearchTestConfiguration.class,
        RedisTestContainer.class,
    }
)
public @interface IntegrationTest {}
