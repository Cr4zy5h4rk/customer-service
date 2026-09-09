package com.silverhand.customer.web.rest;

import com.silverhand.customer.domain.Address;
import com.silverhand.customer.repository.AddressRepository;
import com.silverhand.customer.repository.search.AddressSearchRepository;
import com.silverhand.customer.web.rest.errors.BadRequestAlertException;
import com.silverhand.customer.web.rest.errors.ElasticsearchExceptionMapper;
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
 * REST controller for managing {@link com.silverhand.customer.domain.Address}.
 */
@RestController
@RequestMapping("/api/addresses")
@Transactional(rollbackFor = Exception.class)
public class AddressResource {

    private static final Logger LOG = LoggerFactory.getLogger(AddressResource.class);

    private static final String ENTITY_NAME = "customerAddress";

    @Value("${jhipster.clientApp.name:customer}")
    private String applicationName;

    private final AddressRepository addressRepository;

    private final AddressSearchRepository addressSearchRepository;

    public AddressResource(AddressRepository addressRepository, AddressSearchRepository addressSearchRepository) {
        this.addressRepository = addressRepository;
        this.addressSearchRepository = addressSearchRepository;
    }

    /**
     * {@code POST  /addresses} : Create a new address.
     *
     * @param address the address to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new address, or with status {@code 400 (Bad Request)} if the address has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Address> createAddress(@RequestBody Address address) throws URISyntaxException {
        LOG.debug("REST request to save Address : {}", address);
        if (address.getId() != null) {
            throw new BadRequestAlertException("A new address cannot already have an ID", ENTITY_NAME, "idexists");
        }
        address = addressRepository.save(address);
        addressSearchRepository.index(address);
        return ResponseEntity.created(new URI("/api/addresses/" + address.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, address.getId().toString()))
            .body(address);
    }

    /**
     * {@code PUT  /addresses/:id} : Updates an existing address.
     *
     * @param id the id of the address to save.
     * @param address the address to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated address,
     * or with status {@code 400 (Bad Request)} if the address is not valid,
     * or with status {@code 500 (Internal Server Error)} if the address couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable(value = "id", required = false) final Long id, @RequestBody Address address)
        throws URISyntaxException {
        LOG.debug("REST request to update Address : {}, {}", id, address);
        if (address.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, address.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!addressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        address = addressRepository.save(address);
        addressSearchRepository.index(address);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, address.getId().toString()))
            .body(address);
    }

    /**
     * {@code PATCH  /addresses/:id} : Partial updates given fields of an existing address, field will ignore if it is null
     *
     * @param id the id of the address to save.
     * @param address the address to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated address,
     * or with status {@code 400 (Bad Request)} if the address is not valid,
     * or with status {@code 404 (Not Found)} if the address is not found,
     * or with status {@code 500 (Internal Server Error)} if the address couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Address> partialUpdateAddress(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Address address
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Address partially : {}, {}", id, address);
        if (address.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, address.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!addressRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Address> result = addressRepository
            .findById(address.getId())
            .map(existingAddress -> {
                updateIfPresent(existingAddress::setStreet, address.getStreet());
                updateIfPresent(existingAddress::setCity, address.getCity());
                updateIfPresent(existingAddress::setCountry, address.getCountry());

                return existingAddress;
            })
            .map(addressRepository::save)
            .map(savedAddress -> {
                addressSearchRepository.index(savedAddress);
                return savedAddress;
            });

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, address.getId().toString())
        );
    }

    /**
     * {@code GET  /addresses} : get all the Addresses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of Addresses in body.
     */
    @GetMapping("")
    public List<Address> getAllAddresses() {
        LOG.debug("REST request to get all Addresses");
        return addressRepository.findAll();
    }

    /**
     * {@code GET  /addresses/:id} : get the "id" address.
     *
     * @param id the id of the address to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the address, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddress(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Address : {}", id);
        Optional<Address> address = addressRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(address);
    }

    /**
     * {@code DELETE  /addresses/:id} : delete the "id" address.
     *
     * @param id the id of the address to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Address : {}", id);
        addressRepository.deleteById(id);
        addressSearchRepository.deleteFromIndexById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /addresses/_search?query=:query} : search for the address corresponding
     * to the query.
     *
     * @param query the query of the address search.
     * @return the result of the search.
     */
    @GetMapping("/_search")
    public List<Address> searchAddresses(@RequestParam("query") String query) {
        LOG.debug("REST request to search Addresses for query {}", query);
        try {
            return StreamSupport.stream(addressSearchRepository.search(query).spliterator(), false).toList();
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
