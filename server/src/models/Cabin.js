const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class Cabin {
  static async findAll() {
    // Get all cabins with their images
    const [cabins] = await db.query('SELECT * FROM cabins');
    for (let cabin of cabins) {
      const [images] = await db.query('SELECT image_url FROM cabin_images WHERE cabin_id = ?', [cabin.id]);
      cabin.images = images.map(img => img.image_url);
    }
    return cabins;
  }

  static async findById(id) {
    const [cabins] = await db.query('SELECT * FROM cabins WHERE id = ?', [id]);
    if (cabins.length === 0) return null;
    const cabin = cabins[0];
    
    const [images] = await db.query('SELECT image_url FROM cabin_images WHERE cabin_id = ?', [id]);
    cabin.images = images.map(img => img.image_url);
    
    return cabin;
  }

  static async create({ name, location, price_per_night, description, images = [] }) {
    const id = uuidv4();
    await db.query(
      'INSERT INTO cabins (id, name, location, price_per_night, description) VALUES (?, ?, ?, ?, ?)',
      [id, name, location, price_per_night, description]
    );

    for (let imageUrl of images) {
      await db.query('INSERT INTO cabin_images (cabin_id, image_url) VALUES (?, ?)', [id, imageUrl]);
    }

    return this.findById(id);
  }

  static async update(id, { name, location, price_per_night, description }) {
    await db.query(
      'UPDATE cabins SET name = ?, location = ?, price_per_night = ?, description = ? WHERE id = ?',
      [name, location, price_per_night, description, id]
    );
    return this.findById(id);
  }

  static async addImage(cabinId, imageUrl) {
    await db.query('INSERT INTO cabin_images (cabin_id, image_url) VALUES (?, ?)', [cabinId, imageUrl]);
  }
}

module.exports = Cabin;
