package com.HS.Controller;

import com.HS.Service.HomeCategoryService;
import com.HS.Service.Service.HomeService;
import com.HS.modal.Home;
import com.HS.modal.HomeCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomeCategoryController {
    private final HomeCategoryService homeCategoryService;
    private final HomeService homeService;

    @PostMapping("/home/categories")
    public ResponseEntity<Home> createHomeCategories(
            @RequestBody List<HomeCategory> homeCategories
            ) {
        List<HomeCategory> categories = homeCategoryService.createCategories(homeCategories);
        Home home = homeService.createHomePageData(categories);
        return new ResponseEntity<>(home, HttpStatus.ACCEPTED);
    }

    @GetMapping("admin/home-category")
    public ResponseEntity<List<HomeCategory>> getHomeCategory(
    ) throws Exception {

        List<HomeCategory> categories=homeCategoryService.getAllHomeCategories();
        return ResponseEntity.ok(categories);
    }

    @PatchMapping("/admin/home-category/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(
            @PathVariable Long id,
            @RequestBody HomeCategory homeCategory) throws Exception{
        HomeCategory updatedCategory = homeCategoryService.updateCategory(homeCategory,id);
        return ResponseEntity.ok(updatedCategory);
    }
    @DeleteMapping("/admin/home-category/{id}")
    public ResponseEntity<String> deleteHomeCategory(
            @PathVariable Long id
    ) throws Exception {

        homeCategoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }

}
