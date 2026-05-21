package com.HS.Controller;

import com.HS.Service.Service.ProductService;
import com.HS.Service.Service.ReviewService;
import com.HS.Service.Service.UserService;
import com.HS.modal.Product;
import com.HS.modal.Review;
import com.HS.modal.User;
import com.HS.request.CreateReviewRequest;
import com.HS.response.ApiResponse;
import jdk.jshell.spi.ExecutionControl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;
    private  final ProductService productService;

    @GetMapping ("/products/{productId}/review")
    public ResponseEntity<List<Review>> getReviewByProductId(
            @PathVariable Long productId) {

        List<Review> reviews = reviewService.getReviewProductId(productId);
        return ResponseEntity.ok(reviews);
    }
        @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(
                @RequestBody CreateReviewRequest req,
                @PathVariable Long productId,
                @RequestHeader("Authorization") String jwt) throws Exception {

            User user = userService.findUserByJwtToken(jwt);
            Product product = productService.findProductById(productId);

            Review review =reviewService.createReview(
                    req, user, product
            );
            return ResponseEntity.ok(review);

        }
    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String jwt)
            throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Review review = reviewService.updateReview(
                reviewId,
                req.getReviewText(),
                req.getReviewRating(),
                user.getId()
        );
        return ResponseEntity.ok(review);
    }
    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(
            @PathVariable Long reviewId,
            @RequestHeader("Authorization")String jwt) throws Exception {

        User user =userService.findUserByJwtToken(jwt);

        reviewService.deleteReview(reviewId, user.getId());
        ApiResponse res = new ApiResponse();
        res.setMessage("Review deleted successfully");


        return ResponseEntity.ok(res);
    }

    //Deal Review

    @GetMapping("/deals/{dealId}/review")
    public ResponseEntity<List<Review>> getReviewByDealId(
            @PathVariable Long dealId) {

        List<Review> reviews = reviewService.getReviewByDealId(dealId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/deals/{dealId}/reviews")
    public ResponseEntity<Review> writeDealReview(
            @RequestBody CreateReviewRequest req,
            @PathVariable Long dealId,
            @RequestHeader("Authorization") String jwt) throws Exception {

        User user = userService.findUserByJwtToken(jwt);

        Review review = reviewService.createDealReview(
                req,
                user,
                dealId
        );

        return ResponseEntity.ok(review);
    }



}
