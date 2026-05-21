package com.HS.Controller;

import com.HS.Service.Service.DealService;
import com.HS.modal.Deal;
import com.HS.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/deals")
public class DealController {
    private final DealService dealService;

    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals(

    ){
        List<Deal> createDeals = dealService.getDeals();

        return new ResponseEntity<>(createDeals, HttpStatus.ACCEPTED);
    }

    @PostMapping
    public ResponseEntity<Deal> createDeals(
            @RequestBody Deal deals
    ){
        Deal createDeals = dealService.createDeal(deals);

        return new ResponseEntity<>(createDeals, HttpStatus.ACCEPTED);
    }

//    @PostMapping
//    public ResponseEntity<Deal> createDeals(
//            @RequestBody Deal deal,
//            @RequestHeader("Authorization") String token
//    ) {
//
//        Deal createDeals = dealService.createDeal(deal);
//
//        return ResponseEntity.ok(createDeals);
//    }

    @PatchMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(
            @PathVariable Long id,
            @RequestBody Deal deal
    )throws Exception{

        Deal updatedDeal=dealService.updateDeal(deal,id);
        return ResponseEntity.ok(updatedDeal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDeals(
            @PathVariable Long id
    ) throws Exception{
        dealService.deleteDeal(id);

        ApiResponse apiResponse=new ApiResponse();
        apiResponse.setMessage("Deal deleted");

        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
    }
    @GetMapping("/category/{id}")
    public ResponseEntity<List<Deal>> getDealsByCategory(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(dealService.getDealsByCategory(id));
    }

    @GetMapping("/category/{id}/filter")
    public ResponseEntity<List<Deal>> getDealsByCategoryWithFilter(
            @PathVariable Long id,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer mindiscount
    ) {

        List<Deal> deals = dealService.getDealsByCategoryFilter(
                id,
                color,
                minPrice,
                maxPrice,
                mindiscount
        );

        return ResponseEntity.ok(deals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Deal> getDealById(@PathVariable Long id) {
        Deal deal = dealService.getDealById(id);
        return ResponseEntity.ok(deal);
    }
}



