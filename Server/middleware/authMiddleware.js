import jwt from "jsonwebtoken";

const JWT_SECRET = "mysecretkey"; // same secret used in login

const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided ❌" });
    }

    // 2️⃣ Extract token (Bearer token)
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4️⃣ Attach user data to request
    req.user = decoded;

    // 5️⃣ Move to next
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

export default authMiddleware;