//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.HomeCategoryRepository;
//import com.HS.Service.HomeCategoryService;
//import com.HS.modal.HomeCategory;
//import com.fasterxml.jackson.core.PrettyPrinter;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class HomeCategoryServiceImpl implements HomeCategoryService {
//
//    private final HomeCategoryRepository homeCategoryRepository;
//
//    @Override
//    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
//        return homeCategoryRepository.save(homeCategory);
//    }
//
//    @Override
//    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
//        if (homeCategoryRepository.findAll().isEmpty()) {
//
//            return homeCategoryRepository.saveAll(homeCategories);
//        }
//        return homeCategoryRepository.findAll();
//    }
//
//    @Override
//    public HomeCategory updateCategory(HomeCategory category, Long id) throws Exception {
//       HomeCategory existingCategory= homeCategoryRepository.findById(id)
//               .orElseThrow(()-> new Exception("Category not found"));
//       if (category.getImage()!=null){
//           existingCategory.setCategoryId(category.getCategoryId());
//       }
//       return homeCategoryRepository.save(existingCategory);
//    }
//
//    public void deleteCategory(Long id) throws Exception {
//        HomeCategory category = homeCategoryRepository.findById(id)
//                .orElseThrow(() -> new Exception("Category not found"));
//
//        homeCategoryRepository.delete(category);
//    }
//
//
//    @Override
//    public List<HomeCategory> getAllHomeCategories() {
//       return homeCategoryRepository.findAll();
//    }
//}
//
//
package com.HS.Service.ServiceImpl;

import com.HS.Repository.HomeCategoryRepository;
import com.HS.Service.HomeCategoryService;
import com.HS.modal.HomeCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {

    private final HomeCategoryRepository homeCategoryRepository;

    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        if (homeCategory.getDiscount() == null) {
            homeCategory.setDiscount(0);
        }
        return homeCategoryRepository.save(homeCategory);
    }

//    @Override
//    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
//        if (homeCategoryRepository.findAll().isEmpty()) {
//            return homeCategoryRepository.saveAll(homeCategories);
//        }
//        return homeCategoryRepository.findAll();
//    }
@Override
public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
    return homeCategoryRepository.saveAll(homeCategories);
}

    @Override
    public HomeCategory updateCategory(HomeCategory category, Long id) throws Exception {

        HomeCategory existingCategory = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));

        // ✅ IMAGE UPDATE
        if (category.getImage() != null) {
            existingCategory.setImage(category.getImage());
        }

        // ✅ CATEGORY ID UPDATE
        if (category.getCategoryId() != null) {
            existingCategory.setCategoryId(category.getCategoryId());
        }

        // ✅ NAME UPDATE (optional)
        if (category.getName() != null) {
            existingCategory.setName(category.getName());
        }

        if (category.getDiscount() != null) {
            existingCategory.setDiscount(category.getDiscount());
        }

        // ✅ SECTION UPDATE (enum)
        if (category.getSection() != null) {
            existingCategory.setSection(category.getSection());
        }

        return homeCategoryRepository.save(existingCategory); // 🔥 DB SAVE
    }

    @Override
    public void deleteCategory(Long id) throws Exception {
        HomeCategory category = homeCategoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found"));

        homeCategoryRepository.delete(category);
    }

    @Override
    public List<HomeCategory> getAllHomeCategories() {
        return homeCategoryRepository.findAll();
    }
}
