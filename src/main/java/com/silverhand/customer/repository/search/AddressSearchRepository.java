package com.silverhand.customer.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import com.silverhand.customer.domain.Address;
import com.silverhand.customer.repository.AddressRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Address} entity.
 */
public interface AddressSearchRepository extends ElasticsearchRepository<Address, Long>, AddressSearchRepositoryInternal {}

interface AddressSearchRepositoryInternal {
    Stream<Address> search(String query);

    Stream<Address> search(Query query);

    @Async
    void index(Address entity);

    @Async
    void deleteFromIndexById(Long id);
}

class AddressSearchRepositoryInternalImpl implements AddressSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final AddressRepository repository;

    AddressSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, AddressRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Address> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<Address> search(Query query) {
        return elasticsearchTemplate.search(query, Address.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Address entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Address.class);
    }
}
