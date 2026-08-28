const Apartment = require("../models/apartment");
const Inquiry = require("../models/inquiry");

function listingFields(body) {
  return {
    title: body.title,
    address: body.address,
    neighborhood: body.neighborhood,
    price: body.price,
    bedrooms: body.bedrooms,
    bathrooms: body.bathrooms,
    sqft: body.sqft,
    type: body.type,
    description: body.description,
    amenities: body.amenities,
    photos: body.photos,
    availableFrom: body.availableFrom,
    status: body.status,
    tags: body.tags,
    isFeatured: body.isFeatured,
  };
}

function requiredListingMissing(body) {
  const title = body.title;
  const address = body.address;
  const price = body.price;
  const bedrooms = body.bedrooms;
  const bathrooms = body.bathrooms;
  const description = body.description;

  return (
    !title ||
    !address ||
    price === undefined ||
    price === null ||
    bedrooms === undefined ||
    bedrooms === null ||
    bathrooms === undefined ||
    bathrooms === null ||
    !description
  );
}

const getApartments = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.bedrooms !== undefined) {
      filter.bedrooms = Number(req.query.bedrooms);
    }
    if (req.query.location) {
      filter.$or = [
        { address: { $regex: req.query.location, $options: "i" } },
        { neighborhood: { $regex: req.query.location, $options: "i" } },
        { title: { $regex: req.query.location, $options: "i" } },
      ];
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice);
      }
    }
    if (req.query.featured === "true") {
      filter.isFeatured = true;
    }

    const apartments = await Apartment.find(filter).populate(
      "landlord",
      "fullName email phone profileImage",
    );
    res.status(200).json(apartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const getMyApartments = async (req, res) => {
  try {
    const apartments = await Apartment.find({ landlord: req.user.id }).populate(
      "landlord",
      "fullName email phone profileImage",
    );
    res.status(200).json(apartments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const getApartmentById = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id).populate(
      "landlord",
      "fullName email phone profileImage",
    );

    if (apartment === null) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    apartment.views += 1;
    await apartment.save();

    res.status(200).json(apartment);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid apartment id" });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const createApartment = async (req, res) => {
  try {
    if (requiredListingMissing(req.body)) {
      return res.status(400).json({
        message:
          "Title, address, price, bedrooms, bathrooms and description are required",
      });
    }

    const newApartment = await Apartment.create({
      ...listingFields(req.body),
      landlord: req.user.id,
    });

    const populated = await Apartment.findById(newApartment._id).populate(
      "landlord",
      "fullName email phone profileImage",
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const updateApartment = async (req, res) => {
  try {
    if (requiredListingMissing(req.body)) {
      return res.status(400).json({
        message:
          "Title, address, price, bedrooms, bathrooms and description are required",
      });
    }

    const apartment = await Apartment.findById(req.params.id);
    if (apartment === null) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    if (String(apartment.landlord) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You can only update your own listings" });
    }

    const updatedApartment = await Apartment.findByIdAndUpdate(
      req.params.id,
      listingFields(req.body),
      { new: true, runValidators: true },
    ).populate("landlord", "fullName email phone profileImage");

    if (updatedApartment.status === "rented") {
      await Inquiry.updateMany(
        { apartment: updatedApartment._id, status: { $ne: "closed" } },
        { status: "closed" },
      );
    }

    res.status(200).json(updatedApartment);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid apartment id" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const deleteApartment = async (req, res) => {
  try {
    const apartment = await Apartment.findById(req.params.id);
    if (apartment === null) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    if (String(apartment.landlord) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own listings" });
    }

    await Inquiry.deleteMany({ apartment: apartment._id });
    await Apartment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Apartment deleted successfully" });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid apartment id" });
    }
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

const apartmentController = {
  getApartments,
  getMyApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
};

module.exports = apartmentController;
