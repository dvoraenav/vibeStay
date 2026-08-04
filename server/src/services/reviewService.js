const Review = require('../models/Review');

class ReviewService {
  static async createReview(data) {
    return Review.create(data);
  }

  static async getCabinReviews(cabinId) {
    return Review.findByCabinId(cabinId);
  }

  static async getAllReviews() {
    return Review.findAll();
  }

  static async deleteReview(id) {
    return Review.deleteById(id);
  }

  static async addAdminReply(id, reply) {
    return Review.updateAdminReply(id, reply);
  }
}

module.exports = ReviewService;
