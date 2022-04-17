const mongoose = require("mongoose");

const PaimentSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: { type: Number, required: true },
        paymentId: { type: String, required: true },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],

    },
    { timestamps: true }
);

module.exports = mongoose.model("Paiment", PaimentSchema);
