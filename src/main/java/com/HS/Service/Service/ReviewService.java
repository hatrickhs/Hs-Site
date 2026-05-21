package com.HS.Service.Service;

import com.HS.modal.Deal;
import com.HS.modal.Product;
import com.HS.modal.Review;
import com.HS.modal.User;
import com.HS.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {

    Review createReview(CreateReviewRequest req,
                        User user,
                        Product product);
    List<Review> getReviewProductId(Long productId);

    Review updateReview(Long reviewId,String reviewText,double rating,Long userId) throws Exception;

    void deleteReview(Long reviewId,Long userId) throws Exception;

    Review getReviewById(Long reviewId) throws Exception;

    Review createDealReview(CreateReviewRequest req, User user, Long dealId);

    List<Review> getReviewByDealId(Long dealId);

}
