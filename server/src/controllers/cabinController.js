const cabinService = require('../services/cabinService');

exports.getAllCabins = async (req, res) => {
  try {
    const cabins = await cabinService.getAllCabins();
    res.json(cabins);
  } catch (error) {
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};

exports.getCabinById = async (req, res) => {
  try {
    const { id } = req.params;
    const cabin = await cabinService.getCabinById(id);
    res.json(cabin);
  } catch (error) {
    if (error.message === 'צימר לא נמצא') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'שגיאת שרת פנימית', error: error.message });
  }
};