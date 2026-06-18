const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerName: { type: String, required: true },
  reviewerAge: { type: Number },
  reviewerCity: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  helpful: { type: Number, default: 0 },
  notHelpful: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  ageGroup: { type: String, required: true },
  ageMin: { type: Number },
  ageMax: { type: Number },
  brand: { type: String, default: 'BLUSH & BLOOM' },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  discount: { type: Number }, // Auto-computed percentage
  images: [{ type: String, required: true }],
  hoverImage: { type: String, required: true },
  sizes: [{ type: String, required: true }],
  stock: { type: Number, required: true, default: 0 },
  fabric: { type: String },
  occasion: { type: String },
  washCare: { type: String },
  isFeatured: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [reviewSchema],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to compute discount
productSchema.pre('save', function (next) {
  if (this.mrp && this.price) {
    if (this.mrp > this.price) {
      this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    } else {
      this.discount = 0;
    }
  } else {
    this.discount = 0;
  }
  
  // Recalculate average rating
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    this.rating.average = Number((total / this.reviews.length).toFixed(1));
    this.rating.count = this.reviews.length;
  } else {
    this.rating.average = this.rating.average || 0;
    this.rating.count = this.rating.count || 0;
  }

  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
