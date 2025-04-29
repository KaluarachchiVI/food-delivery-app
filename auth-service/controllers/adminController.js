// Verify a restaurant registration
exports.verifyRestaurant = async (req, res) => {
    const { restaurantId, status } = req.body; // status: 'approved' or 'rejected'

    await Restaurant.findByIdAndUpdate(restaurantId, { isVerified: status === 'approved' });
    res.json({ message: `Restaurant ${status}` });
};

// Get all pending restaurant registrations
exports.getPendingRestaurants = async (req, res) => {
    const restaurants = await Restaurant.find({ isVerified: false });
    res.json(restaurants);
};

// Financial report (total sales, orders per restaurant)
exports.getFinancialReport = async (req, res) => {
    const report = await Order.aggregate([
        {
            $group: {
                _id: "$restaurantId",
                totalSales: { $sum: "$totalPrice" },
                orderCount: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "restaurants",
                localField: "_id",
                foreignField: "_id",
                as: "restaurant",
            }
        },
    ]);
    res.json(report);
};