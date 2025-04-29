const express = require("express");
const router = express.Router();
const { authorizeRoles } = require("../middleware/authMiddleware");
const {
    verifyRestaurant,
    getPendingRestaurants,
    getFinancialReport,
} = require("../controllers/adminController");

router.use(authorizeRoles("admin")); // All routes require admin role

router.post("/verify-restaurant", verifyRestaurant);
router.get("/pending-restaurants", getPendingRestaurants);
router.get("/financial-report", getFinancialReport);

module.exports = router;