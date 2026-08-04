const reviewService = require('../services/reviewService');

exports.addReview = async (req, res) => {
  try {
    const { cabin_id, rating, comment } = req.body;
    const user_id = req.user.userId;

    if (!cabin_id || !rating) {
      return res.status(400).json({ message: 'נא למלא דירוג וצימר' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'הדירוג חייב להיות בין 1 ל-5' });
    }

    const reviewId = await reviewService.createReview({ cabin_id, user_id, rating, comment });
    res.status(201).json({ message: 'הביקורת נוספה בהצלחה', reviewId });
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.getCabinReviews = async (req, res) => {
  try {
    const { cabinId } = req.params;
    const reviews = await reviewService.getCabinReviews(cabinId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};
