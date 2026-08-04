const Cabin = require('../models/Cabin');

class CabinService {
  static async getAllCabins() {
    return Cabin.findAll();
  }

  static async getCabinById(id) {
    const cabin = await Cabin.findById(id);
    if (!cabin) {
      throw new Error('צימר לא נמצא');
    }
    return cabin;
  }

  static async createCabin(data) {
    return Cabin.create(data);
  }

  static async updateCabin(id, data) {
    return Cabin.update(id, data);
  }

  static async addCabinImage(cabinId, imageUrl) {
    await Cabin.addImage(cabinId, imageUrl);
  }
}

module.exports = CabinService;
