package com.silverhand.customer.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import com.silverhand.customer.domain.Customer;
import com.silverhand.customer.repository.CustomerRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Customer} entity.
 */
public interface CustomerSearchRepository extends ElasticsearchRepository<Customer, Long>, CustomerSearchRepositoryInternal {}

interface CustomerSearchRepositoryInternal {
    Stream<Customer> search(String query);

    Stream<Customer> search(Query query);

    @Async
    void index(Customer entity);

    @Async
    void deleteFromIndexById(Long id);
}

class CustomerSearchRepositoryInternalImpl implements CustomerSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final CustomerRepository repository;

    CustomerSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, CustomerRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Customer> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<Customer> search(Query query) {
        return elasticsearchTemplate.search(query, Customer.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Customer entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Customer.class);
    }
}
