console.log("SERVER FILE IS RUNNING");
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.OPENAI_API_KEY);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/authMiddleware.js";
import adminMiddleware from "./middleware/adminMiddleware.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
const app = express();
const JWT_SECRET = "mysecretkey";
app.use(express.json());
app.use(
  cors({
credentials: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/smart-analytics")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

// GET full profile
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Welcome to your profile 🎉",
      user: { name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});
//ACCESS FOR ADMIN
app.get("/admin/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});
// UPDATE profile
app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({ message: "Profile updated successfully", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Root
app.get("/", (req, res) => {
  res.send("Backend + Database running 🚀");
});

// Create User
app.post("/create-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required ❌" });
    }

    // Validate name format
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "Invalid name format ❌" });
    }
    //validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|rediffmail\.com|yahoo\.com)$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email domain ❌" });
}

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists ❌" });
    }

    // Hash password AFTER validation
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User created successfully ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("User from DB:", user);

    if (!user)
      return res.status(400).json({ message: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password ❌" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/admin-dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Welcome Admin 👑" });
});
//change password
app.post("/auth/change-password", authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 5) {
      return res.status(400).json({ message: "Password too short" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword,
    });

    res.json({ message: "Password updated successfully ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});
// DELETE account (only deletes logged-in user)
app.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    // Always use the ID from token for security
    const deletedUser = await User.findByIdAndDelete(req.user.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found ❌" });

    res.status(200).json({ message: "User deleted successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user ❌" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));