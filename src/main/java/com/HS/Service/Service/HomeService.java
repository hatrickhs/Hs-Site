package com.HS.Service.Service;

import com.HS.modal.Home;
import com.HS.modal.HomeCategory;

import java.util.List;

public interface HomeService {
    public Home createHomePageData(List<HomeCategory> allCategories);

}
