const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeschema = new Schema(
{
    count:{
        type:Number,
        required:true,
    },
    isLiked:{
        type:Boolean,
        default:false,
    }
}


)
module.exports = mongoose.model("like", likeschema);