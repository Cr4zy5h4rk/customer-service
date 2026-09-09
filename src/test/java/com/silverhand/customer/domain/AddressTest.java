package com.silverhand.customer.domain;

import static com.silverhand.customer.domain.AddressTestSamples.*;
import static com.silverhand.customer.domain.CustomerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.silverhand.customer.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AddressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Address.class);
        Address address1 = getAddressSample1();
        Address address2 = new Address();
        assertThat(address1).isNotEqualTo(address2);

        address2.setId(address1.getId());
        assertThat(address1).isEqualTo(address2);

        address2 = getAddressSample2();
        assertThat(address1).isNotEqualTo(address2);
    }

    @Test
    void customerTest() {
        Address address = getAddressRandomSampleGenerator();
        Customer customerBack = getCustomerRandomSampleGenerator();

        address.setCustomer(customerBack);
        assertThat(address.getCustomer()).isEqualTo(customerBack);

        address.customer(null);
        assertThat(address.getCustomer()).isNull();
    }
}
