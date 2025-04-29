import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

// Create restaurant
export const createRestaurant = async (req, res) => {
    try {
        const { name, location } = req.body;  // Extracting location from the request body

        // Ensure location is provided with the correct structure
        if (!location || !location.type || !location.coordinates) {
            return res.status(400).json({ message: "Location is required and must have 'type' and 'coordinates'" });
        }

        // Create the new restaurant
        const newRestaurant = await Restaurant.create({
            name,
            ownerId: req.user.id,
            location  // Include location in the creation process
        });

        res.status(201).json(newRestaurant);
    } catch (err) {
        res.status(500).json({ message: "Failed to create restaurant", error: err.message });
    }
};


// Add menu item
export const addMenuItem = async (req, res) => {
    try {
        const { restaurantId, name, description, price } = req.body;
        const item = await MenuItem.create({ restaurantId, name, description, price });
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: "Failed to add item", error: err.message });
    }
};

// Get menu for restaurant
export const getMenu = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const items = await MenuItem.find({ restaurantId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch menu", error: err.message });
    }
};

// Update item
export const updateItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: "Update failed", error: err.message });
    }
};

// Delete item
export const deleteItem = async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
};


