const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get all cabins (including their primary/first image)
exports.getAllCabins = async (req, res) => {
  try {
    const [cabins] = await db.query(`
      SELECT c.*, 
             (SELECT image_url FROM cabin_images WHERE cabin_id = c.id LIMIT 1) AS primary_image
      FROM cabins c
    `);
    res.json(cabins);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cabins', error: error.message });
  }
};

// Get a single cabin by ID (including all image gallery items and reviews)
exports.getCabinById = async (req, res) => {
  const { id } = req.params;
  try {
    const [cabins] = await db.query('SELECT * FROM cabins WHERE id = ?', [id]);
    if (cabins.length === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }

    const [images] = await db.query('SELECT id, image_url FROM cabin_images WHERE cabin_id = ?', [id]);
    const [reviews] = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.full_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.cabin_id = ?
    `, [id]);

    res.json({
      ...cabins[0],
      images,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cabin', error: error.message });
  }
};

// Create a new cabin (Admin only)
exports.createCabin = async (req, res) => {
  const { name, description, pricePerNight, location } = req.body;
  
  if (!name || !pricePerNight || !location) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const cabinId = uuidv4(); // Non-incremental UUID

  try {
    await db.query(
      'INSERT INTO cabins (id, name, description, price_per_night, location) VALUES (?, ?, ?, ?, ?)',
      [cabinId, name, description || '', pricePerNight, location]
    );

    res.status(201).json({
      message: 'Cabin created successfully',
      cabin: { id: cabinId, name, description, pricePerNight, location }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating cabin', error: error.message });
  }
};

// Partial update (PATCH) - Only updates provided fields dynamically
exports.updateCabinPatch = async (req, res) => {
  const { id } = req.params;
  const updates = req.body; // e.g. { price_per_night: 900 }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  // Dynamic SQL query generation for provided fields only
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    // Map camelCase keys to snake_case DB columns if necessary
    let dbKey = key;
    if (key === 'pricePerNight') dbKey = 'price_per_night';

    fields.push(`${dbKey} = ?`);
    values.push(value);
  }

  values.push(id);

  const sql = `UPDATE cabins SET ${fields.join(', ')} WHERE id = ?`;

  try {
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }
    res.json({ message: 'Cabin updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cabin', error: error.message });
  }
};

// Delete cabin (Admin only) - DB will execute CASCADE delete on associated images/reviews
exports.deleteCabin = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM cabins WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }
    res.json({ message: 'Cabin and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cabin', error: error.message });
  }
};