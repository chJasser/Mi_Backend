var express = require("express");
var router = express.Router();
const Product = require("../models/product");
var { productValidator } = require("../validators/productValidator");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { multerUpload, auth } = require("../lib/utils");
const { verifyTokenSeller } = require("../middleware/verifyToken");
const { TrustProductsEvaluationsContext } = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEvaluations");
const Rate =require("../models/rate");

const Rateuser = require("../models/rateuser");

const user = require("../models/user");

router.get("/product/:id",(req,res)=>{
Product.findById(req.params.id).then((product)=>{
  if(!product){
    res.status(404).send({message:'product not found'})
  } else{
res.status(200).json(product)}

}).catch((err)=>{
res.status(500).json(err);
})
})


router.get("/filter", (req, res) => {
  var { label, category, marque, minPrice, maxPrice, reference, state, type } =
    req.body;

  let Productfeilds = {};
  let minP = 0;
  let maxP = 100000;
  if (maxPrice) maxP = maxPrice;
  if (minPrice) minP = minPrice;
  if (label) Productfeilds.label = label;
  if (category) Productfeilds.category = category;
  if (marque) Productfeilds.marque = marque;
  if (reference) Productfeilds.reference = reference;
  if (state) Productfeilds.state = state;
  if (type) Productfeilds.type = type;

  if (!Productfeilds) {
    Product.find().then((products) => res.json(products));
  } else {
    Product.find(Productfeilds)
      .where("price")
      .gte(minP)
      .lte(maxP)
      .then((result) => {
        res.status(200).json({ products: result });
      });
  }
});
/**
 *
 *
 *
 *
 */
router.get("/", [auth], (req, res) => {
  const {
    label,
    category,
    marque,
    minPrice,
    maxPrice,
    reference,
    state,
    type,
  } = req.body;
  if (req.user.role == "seller") Productfeilds.seller = req.user._id;
  Productfeilds.user = req.user._id;
  let Productfeilds = {};
  let minP = 0;
  let maxP = 100000;
  if (maxPrice) maxP = maxPrice;
  if (minPrice) minP = minPrice;
  if (label) Productfeilds.label = label;
  if (category) Productfeilds.category = category;
  if (marque) Productfeilds.marque = marque;
  if (reference) Productfeilds.reference = reference;
  if (state) Productfeilds.state = state;
  if (type) Productfeilds.type = type;

  if (!Productfeilds) {
    Product.find().then((products) => res.json(products));
  } else {
    Product.find(Productfeilds)
      .where("price")
      .gte(minP)
      .lte(maxP)
      .then((result) => {
        res.status(200).json({ products: result });
      });
  }
});

router.post(
  "/addproduct",
  [auth, verifyTokenSeller],
  multerUpload.array("files"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }
    let filesarray = [];
    req.files.forEach((element) => {
      filesarray.push(element.path);
    });

    const newproduct = new Product({
      label: req.body.label,
      category: req.body.category,
      marque: req.body.marque,
      price: req.body.price,
      reference: req.body.reference,
      state: req.body.state,
      type: req.body.type,
      seller: req.user._id,
      productImage: filesarray,
      discountPercent: req.body.discountPercent,
    });

    newproduct.save(function (err, product) {
      if (err) {
        console.log(err.message);
      }
      res.json(product);
    });
  }
);
router.get("/getrating/:id",(req,res)=>{
Product.findById(req.params.id).then((product)=>{
  if(!product){
    res.status(401).json({msg: "product not found"});
  }
  else{
    Rate.find({product:req.params.id},(err,rate)=>{
      
      res.json(rate);

    })
  }
})



})
///


///


router.put("/rating/:id",auth,(req,res)=>{

Product.findById(req.params.id).then((product)=>{
  if (!product) {
    return res.staus(401).json({ msg: "product not found" });
  }
  else{
    
  Rateuser.findOne({user:req.user._id,product:req.params.id} ).then((rateu)=>
    {
    if(rateu){
      Rateuser.findByIdAndUpdate(rateu._id,{$set:{rate:req.body.rate,}} ).then(
      (newrate)=>{
        
        Rateuser.find({product:req.params.id}).then((products)=>{
        
          var allrating=0;
          products.forEach((product)=>{
           allrating+= product.rate;
          })
         
         const nbr=products.length;
        const rates=allrating/nbr;
          var newrating ={
            nbrpeople:nbr,
            rating:rates,
           
          }
          Rate.findOne({product:req.params.id}).then((product)=>{
            if(!product){
              newrating =new Rate({
                nbrpeople:1,
                rating:req.body.rate,
                product:req.params.id,
              
                })
                newrating.save(newrating).then((savedrating)=>{
                  
               
                 })
            }else{
               Rate.findOneAndUpdate({product:req.params.id},{$set:newrating},(err,Rateupdated)=>{
              res.json(Rateupdated);
      
      
               })}
          })
        
          
        })
      }
    );
  
  }
  else if(!rateu){
  newrateuser = new Rateuser({
 user:req.user._id,
 product:req.params.id,
 rate:req.body.rate,

})
newrateuser.save(newrateuser,(err,savedrate)=>{
  Rateuser.find({product:req.params.id}).then((products)=>{
        
    var allrating=0;
    products.forEach((product)=>{
     allrating+= product.rate;
    })
   
   const nbr=products.length;
  const rates=allrating/nbr;
    var newrating ={
      nbrpeople:nbr,
      rating:rates,
     
    }
    
    Rate.findOne({product:req.params.id}).then((product)=>{
      if(!product){
        newrating =new Rate({
          nbrpeople:1,
          rating:req.body.rate,
          product:req.params.id,
        
          })
          newrating.save(newrating).then((savedrating)=>{
            
         
           })
      }else{
         Rate.findOneAndUpdate({product:req.params.id},{$set:newrating},(err,Rateupdated)=>{
        res.json(Rateupdated);


         })}
    })
    
  })



})
 }
}
)  .catch((err)=>{
  res.json({msg:err.message})
})
}
   


}).catch((err)=>{ res.json({msg:err.message})})

})

//
router.put(
  "/:id",
  [auth, verifyTokenSeller],
  multerUpload.array("files"),
  (req, res) => {
    let filesarray = [];

    req.files.forEach((element) => {
      filesarray.push(element.path);
    });
    const { label, category, marque, price, reference, state, type } = req.body;
    let Productfeilds = {};
    if (label) Productfeilds.label = label;
    if (category) Productfeilds.category = category;
    if (marque) Productfeilds.marque = marque;
    if (price) Productfeilds.price = price;
    if (reference) Productfeilds.reference = reference;
    if (state) Productfeilds.state = state;
    if (type) Productfeilds.type = type;
    if (req.files) Productfeilds.productImage = filesarray;

    Product.findById(req.params.id)
      .then((product) => {
        if (!product) {
          return res.json({ msg: "product not found" });
        } else if (product.seller.toString() != req.user._id) {
          res.json({ msg: "Noth authorized" });
        } else {
          Product.findByIdAndUpdate(
            req.params.id,
            { $set: Productfeilds },
            (err, data) => {
              res.json(data);
            }
          );
        }
      })
      .catch((err) => console.log(err.message));
  }
);

router.delete("/:id", [auth, verifyTokenSeller], (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      if (!product) {
        return res.json({ msg: "product not found" });
      } else if (product.seller.toString() != req.user._id) {
        res.json({ msg: "Noth authorized" });
      } else {
        Product.findByIdAndDelete(req.params.id, (err, data) => {
          res.json({ msg: "Product Deleted!" });
        });
      }
    })
    .catch((err) => console.log(err.message));
});

module.exports = router;
