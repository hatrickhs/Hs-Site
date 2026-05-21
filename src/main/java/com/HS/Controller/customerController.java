package com.HS.Controller;

import com.HS.Service.HomeCategoryService;
import com.HS.Service.Service.HomeService;
import com.HS.modal.Home;
import com.HS.modal.HomeCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class customerController {
    private  final HomeCategoryService homeCategoryService;
    private  final HomeService homeService;



        @PostMapping("customer/home/categories")
                public ResponseEntity<Home> createHomeCategories(
                        @RequestBody List<HomeCategory> homeCategories
                ) {
        List<HomeCategory> categories = homeCategoryService.createCategories(homeCategories);
        Home home = homeService.createHomePageData(categories);
        return  new ResponseEntity<>(home, HttpStatus.ACCEPTED);

    }
}
