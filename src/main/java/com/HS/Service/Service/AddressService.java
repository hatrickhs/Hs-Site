package com.HS.Service.Service;

import com.HS.modal.Address;
import java.util.List;

public interface AddressService {

    Address saveAddress(Address address);

    List<Address> getAllAddresses();

    void deleteAddress(Long id);

    Address findById(Long id) throws Exception;
}