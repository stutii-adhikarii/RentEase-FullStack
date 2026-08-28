const Inquiry = require("../models/inquiry");
const Apartment = require("../models/apartment");

const USER_FIELDS = "fullName email phone profileImage role";
const APARTMENT_FIELDS = "title address photos status";

function populateInquiry(query) {
  return query
    .populate("apartment", APARTMENT_FIELDS)
    .populate("tenant", USER_FIELDS)
    .populate("landlord", USER_FIELDS)
    .populate("messages.sender", USER_FIELDS);
}

function canAccessInquiry(inquiry, user) {
  return (
    String(inquiry.tenant._id || inquiry.tenant) === String(user.id) ||
    String(inquiry.landlord._id || inquiry.landlord) === String(user.id)
  );
}

const getInquiries = async (req, res) => {
  try {
    const filter =
      req.user.role === "landlord"
        ? { landlord: req.user.id }
        : { tenant: req.user.id };

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }
    if (req.query.archived === "true") {
      filter.archived = true;
    } else {
      filter.archived = { $ne: true };
    }

    const inquiries = await populateInquiry(
      Inquiry.find(filter).sort({ updatedAt: -1 }),
    );
    res.status(200).json(inquiries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const createInquiry = async (req, res) => {
  try {
    const apartmentId = req.body.apartmentId;
    const message = req.body.message;

    if (!apartmentId || !message) {
      return res
        .status(400)
        .json({ message: "Apartment id and message are required" });
    }

    const apartment = await Apartment.findById(apartmentId);
    if (apartment === null) {
      return res.status(404).json({ message: "Apartment not found" });
    }
    if (String(apartment.landlord) === String(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You cannot inquire about your own listing" });
    }
    if (apartment.status === "rented") {
      return res
        .status(400)
        .json({ message: "This listing is no longer available" });
    }

    const inquiry = await Inquiry.create({
      apartment: apartment._id,
      tenant: req.user.id,
      landlord: apartment.landlord,
      status: "pending",
      messages: [{ sender: req.user.id, body: message.trim() }],
    });

    const populated = await populateInquiry(Inquiry.findById(inquiry._id));
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const replyToInquiry = async (req, res) => {
  try {
    const body = req.body.message;
    if (!body || !String(body).trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry === null) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    if (!canAccessInquiry(inquiry, req.user)) {
      return res.status(403).json({ message: "You cannot reply to this inquiry" });
    }
    if (inquiry.status === "closed") {
      return res.status(400).json({ message: "This inquiry is closed" });
    }

    inquiry.messages.push({ sender: req.user.id, body: String(body).trim() });
    if (req.user.role === "landlord") {
      inquiry.status = "responded";
    }
    await inquiry.save();

    const populated = await populateInquiry(Inquiry.findById(inquiry._id));
    res.status(200).json(populated);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry === null) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    if (!canAccessInquiry(inquiry, req.user)) {
      return res.status(403).json({ message: "You cannot update this inquiry" });
    }

    if (req.body.archived !== undefined) {
      inquiry.archived = Boolean(req.body.archived);
    }
    if (req.body.status) {
      if (!["pending", "responded", "closed"].includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      inquiry.status = req.body.status;
    }

    await inquiry.save();
    const populated = await populateInquiry(Inquiry.findById(inquiry._id));
    res.status(200).json(populated);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid inquiry id" });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const inquiryController = {
  getInquiries,
  createInquiry,
  replyToInquiry,
  updateInquiry,
};

module.exports = inquiryController;
