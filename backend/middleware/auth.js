const jwt = require("jsonwebtoken");

// The professionals sample has no auth middleware. We need it so POST / PUT /
// DELETE listings can only be done by a logged-in landlord, and so we know
// which User _id to store on apartment.landlord.
const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Payload was signed in login: { id, email, role }.
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireLandlord = (req, res, next) => {
  if (!req.user || req.user.role !== "landlord") {
    return res
      .status(403)
      .json({ message: "Only landlords can manage listings" });
  }
  next();
};

const requireTenant = (req, res, next) => {
  if (!req.user || req.user.role !== "tenant") {
    return res
      .status(403)
      .json({ message: "Only tenants can send inquiries" });
  }
  next();
};

module.exports = { auth, requireLandlord, requireTenant };
