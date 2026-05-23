package com.HS.Service.ServiceImpl;

import com.HS.Repository.DealRepository;
import com.HS.Repository.ReviewRepository;
import com.HS.Service.Service.FileService;
import com.HS.Service.Service.ReviewService;
import com.HS.modal.Deal;
import com.HS.modal.Product;
import com.HS.modal.Review;
import com.HS.modal.User;
import com.HS.request.CreateReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final DealRepository dealRepository;
    private final FileService fileService;

//    @Override
//    public Review createReview(CreateReviewRequest req, User user, Product product) {
//        Review review = new Review();
//        review.setUser(user);
//        review.setProduct(product);
//        review.setReviewText(req.getReviewText());
//        review.setRating(req.getReviewRating());
//        review.setProductImages(req.getProductImages());
//
//        product.getReviews().add(review);
//        return reviewRepository.save(review);
//    }

    @Override
    public Review createReview(CreateReviewRequest req, User user, Product product, List<MultipartFile> images) {

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());

        List<String> imageUrls = new ArrayList<>();

        if (images != null) {
            for (MultipartFile img : images) {
                String url = fileService.upload(img); // உங்கள் upload logic
                imageUrls.add(url);
            }
        }

        review.setProductImages(imageUrls);

        product.getReviews().add(review);
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review=getReviewById(reviewId);

        if (review.getUser().getId().equals(userId)){
            review.setReviewText(reviewText);
            review.setRating(rating);
            return reviewRepository.save(review);
        }
        throw new Exception("you can't update this review");
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("you can't delete this review");
        }

        reviewRepository.deleteById(reviewId);
    }

    @Override
    public Review getReviewById(Long reviewId) throws Exception {
        return reviewRepository.findById(reviewId).orElseThrow(()->
                new Exception("review not found"));
    }

    //Deal Review

//    @Override
//    public Review createDealReview(CreateReviewRequest req, User user, Long dealId) {
//
//        Deal deal = dealRepository.findById(dealId)
//                .orElseThrow(() -> new RuntimeException("Deal not found"));
//
//        Review review = new Review();
//        review.setUser(user);
//        review.setDeal(deal); // 🔥 IMPORTANT
//        review.setReviewText(req.getReviewText());
//        review.setRating(req.getReviewRating());
//        review.setProductImages(req.getProductImages());
//
//        return reviewRepository.save(review);
//    }

    @Override
    public Review createDealReview(CreateReviewRequest req, User user, Long dealId, List<MultipartFile> images) {

        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new RuntimeException("Deal not found"));

        Review review = new Review();
        review.setUser(user);
        review.setDeal(deal);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());

        List<String> imageUrls = new ArrayList<>();

        if (images != null) {
            for (MultipartFile img : images) {
                String url = fileService.upload(img);
                imageUrls.add(url);
            }
        }

        review.setProductImages(imageUrls);

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewByDealId(Long dealId) {
        return reviewRepository.findByDealId(dealId);
    }
}
