var express = require("express");
var router = express.Router();
const ProductImage = require("../models/productImage");
var auth=require("../middlewares/verifyToken");
var productValidator=require("../validators/productValidator");
const Product = require("../models/product");

router.get("/",auth, (req, res) => {
    if (req.user.role=="seller"){
        seller= req.user;
        }
        Product.find({
        seller:seller.id

        }).then(products=>res.json(products))
        .catch(err=>
           console.log(err.message))
});

router.post('/addproducts',[auth,productValidator],(req, res)=>{
    const errors=validationResult(req, res);
        if(!errors.isEmpty()){
            res.json({errors:errors.array()});
            }
            const newproduct = new Product({
                label: req.body.label,
                category:req.body.categorty,
                marque:req.body.marque,
                price:req.body.price,
                reference:req.body.reference,
                state:req.body.state,
                type:req.body.type,
                seller:req.user.id

            });

        newproduct.save((err,savedproduct)=>{
        const newproductimage= new ProductImage({
             path: req.body.path,
             product:savedproduct

        })
        newproductimage.save((err,savedprouctimage) => {
            if(err){
                console.log(err.message);
            }
        })



        })
})

module.exports = router;




