//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.DealRepository;
//import com.HS.Repository.HomeCategoryRepository;
//import com.HS.Service.Service.DealService;
//import com.HS.modal.Deal;
//import com.HS.modal.HomeCategory;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class DealServiceImpl implements DealService {
//
//    private final DealRepository dealRepository;
//    public final HomeCategoryRepository homeCategoryRepository;
//
//    @Override
//    public List<Deal> getDeals() {
//        return dealRepository.findAll();
//    }
//
//    @Override
//    public Deal createDeal(Deal deal) {
////        HomeCategory category = homeCategoryRepository.findById(deal.getCategory().getId()).orElseThrow(null);
//        HomeCategory category = homeCategoryRepository
//                .findById(deal.getCategory().getId())
//                .orElseThrow(() -> new RuntimeException("Category not found"));
//
//        // ✅ DEAL section validation
//        if (!category.getSection().name().equals("DEALS")) {
//            throw new RuntimeException("Only DEALS category allowed");
//        }
//
//        Deal newDeal = dealRepository.save(deal);
//        newDeal.setCategory(category);
//        newDeal.setDiscount(deal.getDiscount());
//
//        return dealRepository.save(newDeal);
//    }
//
//    @Override
//    public Deal updateDeal(Deal deal, Long id) throws Exception {
//
//        Deal existingDeal = dealRepository.findById(id)
//                .orElseThrow(() -> new Exception("Deal not found"));
//
//        HomeCategory category = homeCategoryRepository
//                .findById(deal.getCategory().getId())
//                .orElseThrow(() -> new Exception("Category not found"));
//
//        // ✅ validation
//        if (!category.getSection().name().equals("DEALS")) {
//            throw new RuntimeException("Only DEALS category allowed");
//        }
//
//        existingDeal.setName(deal.getName());
//        existingDeal.setColor(deal.getColor());
//        existingDeal.setDiscount(deal.getDiscount());
//        existingDeal.setMrpPrice(deal.getMrpPrice());
//        existingDeal.setSellingPrice(deal.getSellingPrice());
//        existingDeal.setImages(deal.getImages());
//
//        existingDeal.setCategory(category);
//
//        return dealRepository.save(existingDeal);
//    }
//
//
////    @Override
////    public Deal updateDeal(Deal deal, Long id) throws Exception {
////        Deal existingDeal = dealRepository.findById(id).orElseThrow(null);
////        HomeCategory category = homeCategoryRepository.findById(
////                deal.getCategory().getId())
////                .orElseThrow(()-> new Exception("Category not found"));
////
////        if (existingDeal != null) {
////            if (deal.getDiscount() != null) {
////                existingDeal.setDiscount(deal.getDiscount());
////            }
////            if (category != null) {
////                existingDeal.setCategory(category);
////            }
////            return dealRepository.save(existingDeal);
////        }
////
////throw new Exception("Deal not found");
////}
//    @Override
//    public void deleteDeal(Long id) throws Exception {
//        Deal deal = dealRepository.findById(id).orElseThrow(()->
//                new Exception("deal not found"));
//        dealRepository.delete(deal);
//
//    }
//    public List<Deal> getDealsByCategory(Long categoryId) {
//        return dealRepository.findByCategoryId(categoryId);
//    }
//
//}


package com.HS.Service.ServiceImpl;

import com.HS.Repository.DealRepository;
import com.HS.Repository.HomeCategoryRepository;
import com.HS.Repository.SellerRepository;
import com.HS.Security.JwtProvider;
import com.HS.Service.Service.DealService;
import com.HS.Service.Service.UserService;
import com.HS.modal.Deal;
import com.HS.modal.HomeCategory;
import com.HS.modal.Seller;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {

    private final DealRepository dealRepository;
    private final HomeCategoryRepository homeCategoryRepository;
    private final UserService userService;
    private final SellerRepository sellerRepository;
    private  final JwtProvider jwtProvider;

    @Override
    public List<Deal> getDeals() {
        return dealRepository.findAll();
    }

    // 🔥 FILTER METHOD (NEW)
    public List<Deal> getDealsByCategoryFilter(
            Long categoryId,
            String color,
            Integer minPrice,
            Integer maxPrice,
            Integer mindiscount
    ) {
        return dealRepository.filterDeals(
                categoryId,
                color,
                minPrice,
                maxPrice,
                mindiscount
        );
    }

    @Override
    public Deal createDeal(Deal deal) {

        // 1. category check
        HomeCategory category = homeCategoryRepository
                .findById(deal.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (!category.getSection().name().equals("DEALS")) {
            throw new RuntimeException("Only DEALS category allowed");
        }

        deal.setCategory(category);

        if (deal.getExpiryTime() == null) {
            deal.setExpiryTime(null);
        }

        return dealRepository.save(deal);
    }
//@Override
//public Deal createDeal(Deal deal, String token) {
//
//    // 1. Remove Bearer prefix safely
//    String jwt = token.startsWith("Bearer ")
//            ? token.substring(7)
//            : token;
//
//    // 2. Get email from JWT
//    String email = jwtProvider.getEmailFromJwtToken(jwt);
//
//    if (email == null) {
//        throw new RuntimeException("Invalid token");
//    }
//
//    // 3. Get seller from email (NO frontend seller id needed)
//    Seller seller = sellerRepository.findByEmail(email);
//
//    if (seller == null) {
//        throw new RuntimeException("Seller not found for email: " + email);
//    }
//
//    // 4. Category validation
//    HomeCategory category = homeCategoryRepository.findById(
//            deal.getCategory().getId()
//    ).orElseThrow(() -> new RuntimeException("Category not found"));
//
//    if (!category.getSection().name().equals("DEALS")) {
//        throw new RuntimeException("Only DEALS category allowed");
//    }
//
//    // 5. Build deal safely
//    Deal newDeal = new Deal();
//
//    newDeal.setName(deal.getName());
//    newDeal.setColor(deal.getColor());
//    newDeal.setDiscount(deal.getDiscount());
//    newDeal.setMrpPrice(deal.getMrpPrice());
//    newDeal.setSellingPrice(deal.getSellingPrice());
//    newDeal.setImages(deal.getImages());
//    newDeal.setExpiryTime(deal.getExpiryTime());
//
//    newDeal.setCategory(category);
//
//    // 🔥 AUTO SELLER (IMPORTANT FIX)
//    newDeal.setSeller(seller);
//
//    return dealRepository.save(newDeal);
//}


    @Override
    public Deal updateDeal(Deal deal, Long id) throws Exception {

        Deal existingDeal = dealRepository.findById(id)
                .orElseThrow(() -> new Exception("Deal not found"));

        HomeCategory category = homeCategoryRepository
                .findById(deal.getCategory().getId())
                .orElseThrow(() -> new Exception("Category not found"));

        if (!category.getSection().name().equals("DEALS")) {
            throw new RuntimeException("Only DEALS category allowed");
        }

        existingDeal.setName(deal.getName());
        existingDeal.setColor(deal.getColor());
        existingDeal.setDiscount(deal.getDiscount());
        existingDeal.setMrpPrice(deal.getMrpPrice());
        existingDeal.setSellingPrice(deal.getSellingPrice());
        existingDeal.setImages(deal.getImages());
        existingDeal.setCategory(category);
        existingDeal.setExpiryTime(deal.getExpiryTime());

        return dealRepository.save(existingDeal);
    }

    @Override
    public void deleteDeal(Long id) throws Exception {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new Exception("Deal not found"));

        dealRepository.delete(deal);
    }

    public List<Deal> getDealsByCategory(Long categoryId) {
       return dealRepository.findByCategoryId(categoryId);
   }

    @Override
    public Deal getDealById(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deal not found"));
    }

    @Override
    public Deal findById(Long id) throws Exception {
        return dealRepository.findById(id)
                .orElseThrow(() -> new Exception("Deal not found with id: " + id));
    }

}