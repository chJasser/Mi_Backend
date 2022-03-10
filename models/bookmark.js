const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookmarkschema = new Schema(
{
    count:{
        type:Number,
        required:true,
    },
    isBookmarked:{
        type:Boolean,
        default:false,
    }
}


)
module.exports = mongoose.model("bookmark", bookmarkschema);