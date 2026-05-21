package com.HS.Service.Service;

import com.HS.modal.Deal;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DealService {
    List<Deal> getDeals();

//    Deal createDeal(Deal deal,String token);

        Deal createDeal(Deal deal);
    Deal updateDeal(Deal deal,Long id) throws Exception;
    void deleteDeal(Long id) throws Exception;

    List<Deal> getDealsByCategory(Long id);

    List<Deal> getDealsByCategoryFilter(Long id, String color, Integer minPrice, Integer maxPrice, Integer mindiscount);

    Deal getDealById(Long id);

    Deal findById(Long id) throws Exception;

}
