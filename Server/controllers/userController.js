import User from "../models/User.js";   // ✅ THIS LINE IS VERY IMPORTANT

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    if (!req.body) {
      return res.status(400).json({ message: "No body received" });
    }

    const role = req.body.role;

    if (!role) {
      return res.status(400).json({ message: "Role missing" });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};