package com.silverhand.customer.web.rest;

import com.silverhand.customer.domain.Customer;
import com.silverhand.customer.repository.CustomerRepository;
import com.silverhand.customer.repository.search.CustomerSearchRepository;
import com.silverhand.customer.web.rest.errors.BadRequestAlertException;
import com.silverhand.customer.web.rest.errors.ElasticsearchExceptionMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.silverhand.customer.domain.Customer}.
 */
@RestController
@RequestMapping("/api/customers")
@Transactional(rollbackFor = Exception.class)
public class CustomerResource {

    private static final Logger LOG = LoggerFactory.getLogger(CustomerResource.class);

    private static final String ENTITY_NAME = "customerCustomer";

    @Value("${jhipster.clientApp.name:customer}")
    private String applicationName;

    private final CustomerRepository customerRepository;

    private final CustomerSearchRepository customerSearchRepository;

    public CustomerResource(CustomerRepository customerRepository, CustomerSearchRepository customerSearchRepository) {
        this.customerRepository = customerRepository;
        this.customerSearchRepository = customerSearchRepository;
    }

    /**
     * {@code POST  /customers} : Create a new customer.
     *
     * @param customer the customer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new customer, or with status {@code 400 (Bad Request)} if the customer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) throws URISyntaxException {
        LOG.debug("REST request to save Customer : {}", customer);
        if (customer.getId() != null) {
            throw new BadRequestAlertException("A new customer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        customer = customerRepository.save(customer);
        customerSearchRepository.index(customer);
        return ResponseEntity.created(new URI("/api/customers/" + customer.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, customer.getId().toString()))
            .body(customer);
    }

    /**
     * {@code PUT  /customers/:id} : Updates an existing customer.
     *
     * @param id the id of the customer to save.
     * @param customer the customer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customer,
     * or with status {@code 400 (Bad Request)} if the customer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the customer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Customer customer
    ) throws URISyntaxException {
        LOG.debug("REST request to update Customer : {}, {}", id, customer);
        if (customer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        customer = customerRepository.save(customer);
        customerSearchRepository.index(customer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, customer.getId().toString()))
            .body(customer);
    }

    /**
     * {@code PATCH  /customers/:id} : Partial updates given fields of an existing customer, field will ignore if it is null
     *
     * @param id the id of the customer to save.
     * @param customer the customer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated customer,
     * or with status {@code 400 (Bad Request)} if the customer is not valid,
     * or with status {@code 404 (Not Found)} if the customer is not found,
     * or with status {@code 500 (Internal Server Error)} if the customer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Customer> partialUpdateCustomer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Customer customer
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Customer partially : {}, {}", id, customer);
        if (customer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, customer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!customerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Customer> result = customerRepository
            .findById(customer.getId())
            .map(existingCustomer -> {
                updateIfPresent(existingCustomer::setFirstName, customer.getFirstName());
                updateIfPresent(existingCustomer::setLastName, customer.getLastName());
                updateIfPresent(existingCustomer::setEmail, customer.getEmail());

                return existingCustomer;
            })
            .map(customerRepository::save)
            .map(savedCustomer -> {
                customerSearchRepository.index(savedCustomer);
                return savedCustomer;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, customer.getId().toString())
        );
    }

    /**
     * {@code GET  /customers} : get all the Customers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Customers in body.
     */
    @GetMapping("")
    public List<Customer> getAllCustomers() {
        LOG.debug("REST request to get all Customers");
        return customerRepository.findAll();
    }

    /**
     * {@code GET  /customers/:id} : get the "id" customer.
     *
     * @param id the id of the customer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the customer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Customer : {}", id);
        Optional<Customer> customer = customerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(customer);
    }

    /**
     * {@code DELETE  /customers/:id} : delete the "id" customer.
     *
     * @param id the id of the customer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Customer : {}", id);
        customerRepository.deleteById(id);
        customerSearchRepository.deleteFromIndexById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /customers/_search?query=:query} : search for the customer corresponding
     * to the query.
     *
     * @param query the query of the customer search.
     * @return the result of the search.
     */
    @GetMapping("/_search")
    public List<Customer> searchCustomers(@RequestParam("query") String query) {
        LOG.debug("REST request to search Customers for query {}", query);
        try {
            return StreamSupport.stream(customerSearchRepository.search(query).spliterator(), false).toList();
        } catch (RuntimeException e) {
            throw ElasticsearchExceptionMapper.mapException(e);
        }
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
