import express from "express";
import {
    createRestaurant,
    addMenuItem,
    getMenu,
    updateItem,
    deleteItem
} from "../controllers/restaurantController.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// Restaurant owner routes
router.post("/create", authenticate, createRestaurant);
router.post("/menu", authenticate, addMenuItem);
router.get("/menu/:restaurantId", getMenu);
router.put("/menu/:id", authenticate, updateItem);
router.delete("/menu/:id", authenticate, deleteItem);

router.get("/", async (req, res) => {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
});

router.get('/menus', async (req, res) => {
    try {
        const menuItems = await MenuItem.find()
            .populate('restaurantId', 'name') // Optional: still show which restaurant it belongs to
            .exec();
        res.json(menuItems);
    } catch (err) {
        console.error('Error fetching all menu items:', err);
        res.status(500).json({ message: 'Error fetching menu items' });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});





export default router;
