import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;