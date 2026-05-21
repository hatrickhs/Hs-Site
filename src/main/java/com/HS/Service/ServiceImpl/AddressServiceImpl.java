package com.HS.Service.ServiceImpl;

import com.HS.Repository.AddressRepository;
import com.HS.Service.Service.AddressService;
import com.HS.modal.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    @Override
    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Override
    public void deleteAddress(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new RuntimeException("Address not found with id: " + id);
        }
        addressRepository.deleteById(id);
    }
    @Override
    public Address findById(Long id) throws Exception {

        return addressRepository.findById(id)
                .orElseThrow(() ->
                        new Exception("Address not found"));
    }
}