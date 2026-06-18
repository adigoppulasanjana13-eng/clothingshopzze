const Product = require('../models/Product');

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      ageGroup,
      category,
      minPrice,
      maxPrice,
      rating,
      discount,
      sizes,
      sort,
      search,
      page = 1
    } = req.query;

    const query = {};

    // Search query (case insensitive regex on name/description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Age Group Filter (multiple values supported, comma-separated)
    if (ageGroup) {
      const groups = ageGroup.split(',');
      query.ageGroup = { $in: groups };
    }

    // Category Filter (multiple values supported, comma-separated)
    if (category) {
      const cats = category.split(',');
      query.category = { $in: cats };
    }

    // Size Filter (multiple values supported, comma-separated)
    if (sizes) {
      const szs = sizes.split(',');
      query.sizes = { $in: szs };
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Discount Filter (e.g. 10+, 20+, 30+, 50+)
    if (discount) {
      const minDiscount = Number(discount.replace('+', ''));
      if (!isNaN(minDiscount)) {
        query.discount = { $gte: minDiscount };
      }
    }

    // Customer Rating Filter
    if (rating) {
      const minRating = Number(rating.replace('+', ''));
      if (!isNaN(minRating)) {
        query['rating.average'] = { $gte: minRating };
      }
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // Default: New Arrivals
    if (sort) {
      switch (sort) {
        case 'Price: Low to High':
          sortQuery = { price: 1 };
          break;
        case 'Price: High to Low':
          sortQuery = { price: -1 };
          break;
        case 'Top Rated':
          sortQuery = { 'rating.average': -1, 'rating.count': -1 };
          break;
        case 'Most Popular':
          sortQuery = { 'rating.count': -1 };
          break;
        case 'New Arrivals':
          sortQuery = { createdAt: -1 };
          break;
        case 'Relevance':
        default:
          sortQuery = { createdAt: -1 }; // fallback
          break;
      }
    }

    // Pagination
    const limit = 12;
    const skip = (Number(page) - 1) * limit;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: {
        products,
        page: Number(page),
        pages: Math.ceil(totalProducts / limit) || 1,
        totalProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({
        success: true,
        data: product
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      ageGroup,
      ageMin,
      ageMax,
      brand,
      price,
      mrp,
      images,
      hoverImage,
      sizes,
      stock,
      fabric,
      occasion,
      washCare,
      isFeatured,
      isSale
    } = req.body;

    const product = new Product({
      name,
      description,
      category,
      ageGroup,
      ageMin,
      ageMax,
      brand: brand || 'BLUSH & BLOOM',
      price: Number(price),
      mrp: Number(mrp),
      images: Array.isArray(images) ? images : [images],
      hoverImage,
      sizes: Array.isArray(sizes) ? sizes : [sizes],
      stock: Number(stock),
      fabric,
      occasion,
      washCare,
      isFeatured: isFeatured || false,
      isSale: isSale || false
    });

    const createdProduct = await product.save();
    res.status(201).json({
      success: true,
      data: createdProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      ageGroup,
      ageMin,
      ageMax,
      brand,
      price,
      mrp,
      images,
      hoverImage,
      sizes,
      stock,
      fabric,
      occasion,
      washCare,
      isFeatured,
      isSale
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.ageGroup = ageGroup || product.ageGroup;
      product.ageMin = ageMin !== undefined ? Number(ageMin) : product.ageMin;
      product.ageMax = ageMax !== undefined ? Number(ageMax) : product.ageMax;
      product.brand = brand || product.brand;
      product.price = price !== undefined ? Number(price) : product.price;
      product.mrp = mrp !== undefined ? Number(mrp) : product.mrp;
      product.images = images || product.images;
      product.hoverImage = hoverImage || product.hoverImage;
      product.sizes = sizes || product.sizes;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.fabric = fabric || product.fabric;
      product.occasion = occasion || product.occasion;
      product.washCare = washCare || product.washCare;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isSale = isSale !== undefined ? isSale : product.isSale;

      const updatedProduct = await product.save();
      res.json({
        success: true,
        data: updatedProduct
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({
        success: true,
        message: 'Product removed'
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/review
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating: reviewRating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('Product already reviewed');
      }

      // Calculate reviewer's age
      let reviewerAge;
      if (req.user.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(req.user.dateOfBirth);
        reviewerAge = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          reviewerAge--;
        }
      }

      // Get city from default address or standard placeholder
      let reviewerCity = 'India';
      if (req.user.addresses && req.user.addresses.length > 0) {
        const defaultAddr = req.user.addresses.find(a => a.isDefault) || req.user.addresses[0];
        reviewerCity = defaultAddr.city;
      }

      const review = {
        user: req.user._id,
        reviewerName: req.user.name,
        reviewerAge,
        reviewerCity,
        rating: Number(reviewRating),
        comment,
        helpful: 0,
        notHelpful: 0,
        date: new Date()
      };

      product.reviews.push(review);
      await product.save();

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: product
      });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
};
