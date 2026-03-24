import User from "../models/User.js";
import Sale from "../models/Sales.js";
export const getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();

    // Total admins
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Get date 1 month ago
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    // Users created in last 1 month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: lastMonthDate },
    });

    // Users before last month (for growth calculation)
    const previousUsers = totalUsers - newUsersThisMonth;

    let growth = 0;

    if (previousUsers > 0) {
      growth = (newUsersThisMonth / previousUsers) * 100;
    }

    res.status(200).json({
      totalUsers,
      totalAdmins,
      newUsersThisMonth,
      growth: growth.toFixed(2),
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};
//sales
export const getRevenue = async (req, res) => {
  const { filter } = req.query;
  const now = new Date();
  let start, end;

  if (filter === "thisMonth") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = now;
  }

  if (filter === "lastMonth") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 0);
  }

  if (filter === "thisYear") {
    start = new Date(now.getFullYear(), 0, 1);
    end = now;
  }

  if (filter === "lastYear") {
    start = new Date(now.getFullYear() - 1, 0, 1);
    end = new Date(now.getFullYear() - 1, 11, 31);
  }

  const result = await Sale.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  res.json({ revenue: result[0]?.total || 0 });
};
//grwoth
export const getGrowth = async (req, res) => {
  const { filter } = req.query;
  const now = new Date();

  let currentStart, previousStart;

  if (filter === "year") {
    currentStart = new Date(now.getFullYear(), 0, 1);
    previousStart = new Date(now.getFullYear() - 1, 0, 1);
  } else {
    // default = month
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  }

  const currentUsers = await User.countDocuments({
    createdAt: { $gte: currentStart }
  });

  const previousUsers = await User.countDocuments({
    createdAt: { $gte: previousStart, $lt: currentStart }
  });

  let growth = 0;

  if (previousUsers > 0) {
    growth = ((currentUsers - previousUsers) / previousUsers) * 100;
  }

  res.json({ growth: growth.toFixed(2) });
};

export const getMonthlyRevenue = async (req, res) => {
  const data = await Sale.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        revenue: { $sum: "$amount" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json(data);
};

export const getMonthlyGrowth = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        users: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json(data);
};