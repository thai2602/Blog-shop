import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, 
    },
    images: [
      {
        type: String, 
      },
    ],
    description: {
        type: String, 
    },
    contact: {
        phone: { type: String },
        email: { type: String },
        facebook: { type: String },
        address: { type: String },
    },
    products: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        },
    ],
    albums: [
            {
            name: { type: String, required: true },
            products: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
            ],
            },
        ],
    },
    { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
