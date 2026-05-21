package com.HS.Controller;

import com.HS.Service.Service.AddressService;
import com.HS.modal.Address;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    // ➕ Add Address
    @PostMapping("/add")
    public Address addAddress(@RequestBody Address address) {
        return addressService.saveAddress(address);
    }

    // 📥 Get All Addresses
    @GetMapping("/all")
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }

    // 🗑️ Delete Address
    @DeleteMapping("/delete/{id}")
    public String deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return "Address deleted successfully";
    }
}