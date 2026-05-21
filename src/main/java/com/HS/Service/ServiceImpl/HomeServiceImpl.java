//package com.HS.Service.ServiceImpl;
//
//import com.HS.Repository.DealRepository;
//import com.HS.Service.HomeCategoryService;
//import com.HS.Service.Service.HomeService;
//import com.HS.domine.HomeCategorySection;
//import com.HS.modal.Deal;
//import com.HS.modal.Home;
//import com.HS.modal.HomeCategory;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class HomeServiceImpl implements HomeService {
//
//    private final DealRepository dealRepository;
//
//    @Override
//    public Home createHomePageData(List<HomeCategory> allCategories) {
//
//        List<HomeCategory> gridCategories = allCategories.stream()
//                .filter(category -> HomeCategorySection.GRID.equals(category.getSection()))
//                .collect(Collectors.toList());
//
//        List<HomeCategory> shopByCategories = allCategories.stream()
//                .filter(category -> HomeCategorySection.SHOP_BY_CATEGORIES.equals(category.getSection()))
//                .collect(Collectors.toList());
//
//        List<HomeCategory> electricCategories = allCategories.stream()
//                .filter(category -> HomeCategorySection.ELECTRIC_CATEGORIES.equals(category.getSection()))
//                .collect(Collectors.toList());
//
//        List<HomeCategory> dealCategories = allCategories.stream()
//                .filter(category -> HomeCategorySection.DEALS.equals(category.getSection()))
//                .collect(Collectors.toList());
//
//
//        List<Deal> createDeals = new ArrayList<>();
//
//        if (dealRepository.findAll().isEmpty()){
//            List<Deal> deals = allCategories.stream()
//                    .filter(category -> category.getSection() == HomeCategorySection.DEALS)
//                    .map(category -> new Deal(null,10,category))
//                    .collect(Collectors.toList());
//            createDeals = dealRepository.saveAll(deals);
//
//        } else createDeals = dealRepository.findAll();
//
//        Home home = new Home();
//        home.setGrid(gridCategories);
//        home.setShopByCategories(shopByCategories);
//        home.setElectricCategories(electricCategories);
//        home.setDeals(createDeals);
//        home.setDealCategories(dealCategories);
//
//        return home;
//    }
//}

package com.HS.Service.ServiceImpl;

import com.HS.Repository.DealRepository;
import com.HS.Service.Service.HomeService;
import com.HS.domine.HomeCategorySection;
import com.HS.modal.Deal;
import com.HS.modal.Home;
import com.HS.modal.HomeCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {

    private final DealRepository dealRepository;

    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {

        List<HomeCategory> gridCategories = allCategories.stream()
                .filter(category -> HomeCategorySection.GRID.equals(category.getSection()))
                .collect(Collectors.toList());

        List<HomeCategory> shopByCategories = allCategories.stream()
                .filter(category -> HomeCategorySection.SHOP_BY_CATEGORIES.equals(category.getSection()))
                .collect(Collectors.toList());

        List<HomeCategory> electricCategories = allCategories.stream()
                .filter(category -> HomeCategorySection.ELECTRIC_CATEGORIES.equals(category.getSection()))
                .collect(Collectors.toList());

        List<HomeCategory> dealCategories = allCategories.stream()
                .filter(category -> HomeCategorySection.DEALS.equals(category.getSection()))
                .collect(Collectors.toList());

        // FETCH REAL DEALS FROM DATABASE
        List<Deal> createDeals = dealRepository.findAll();

        Home home = new Home();

        home.setGrid(gridCategories);
        home.setShopByCategories(shopByCategories);
        home.setElectricCategories(electricCategories);

        // REAL DEAL DATA
        home.setDeals(createDeals);

        home.setDealCategories(dealCategories);

        return home;
    }
}