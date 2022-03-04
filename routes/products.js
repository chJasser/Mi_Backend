var express = require("express");
var router = express.Router();
const ProductImage = require("../models/productImage");


var{productValidator} =require("../validators/productValidator");
const Product = require("../models/product");
const User=require("../models/user");
const { validationResult } = require("express-validator");
const multer = require('multer');
const verifyToken=require("../middlewares/verifyToken");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
  });
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload=multer({storage: storage,
    limits: {
       fileSize: 1024 * 1024 * 5
     },
     fileFilter: fileFilter});





router.get("/",verifyToken,(req, res) => {

    if (req.user.role=="user"){
        seller= req.user;
        }
        Product.find({
        user:seller.id
        

        }).then(products=>res.json(products))
        .catch(err=>
           console.log(err.message))
           });

router.post('/addproducts',upload.array('files'),(req, res)=>{
    const errors=validationResult(req);
        if(!errors.isEmpty()){
            res.json({errors:errors.array()});
            }
            console.log(req.file);
            let filesarray=[];
            //const savedimages = [];
           req.files.forEach(element => {
               filesarray.push(element.path)
           });
                
                
               
                   //res.json(savedproductimage);
                //  savedimages.push(savedproductimage._id);

                //console.log(req.file);
               const newproduct = new Product({
                    label: req.body.label,
                    category:req.body.category,
                    marque:req.body.marque,
                    price:req.body.price,
                    reference:req.body.reference,
                    state:req.body.state,
                    type:req.body.type,
                    //user:req.user.id,
                    user:req.body.user,
                    productImage:filesarray,
    
                });   


                newproduct.save(function(err, product) {
                    if(err) {
                        console.log(err.message);
                    }
                 res.json(product);

                 /*User.findByIdAndUpdate(product.user,{$push:{"products":product}},(err,saveduser)=> {
                    
                     //res.json(saveduser);
                    })*/
                 })


       
})

router.put("/:id",verifyToken,(req, res)=>{
 const {label,category,marque,price,reference,state,type,images}=req.body;
 let Productfeilds = {}
    if(label) Productfeilds.label = label
    if(category) Productfeilds.category = category
    if(marque) Productfeilds.marque = marque
    if(price) Productfeilds.price = price
    if(reference) Productfeilds.reference = reference
    if(state) Productfeilds.state = state
    if(type) Productfeilds.type = type
    if(images) Productfeilds.images = images

Product.findById(req.params.id)
        .then(product =>{
            if(!product){
                return res.json({msg: 'product not found'})
            }else if(product.user.toString() !== req.user.id){
                res.json({msg: 'Noth authorized'})
            }else{
                Product.findByIdAndUpdate(req.params.id, {$set: Productfeilds}, (err, data)=>{
                   // res.json({msg: "Music Updated!"})
                   res.json(data);

                })
            }
        })
        .catch(err => console.log(err.message))




})


router.delete("/:id",verifyToken,(req, res)=>{
    Product.findById(req.params.id)
    .then(product =>{
        if(!product){
            return res.json({msg: 'product not found'})
        }else if(product.user.toString() !== req.user.id){
            res.json({msg: 'Noth authorized'})
        }else{
            Product.findByIdAndDelete(req.params.id,  (err, data)=>{
               res.json({msg: "Product Deleted!"})
               

            })
        }
    })
    .catch(err => console.log(err.message))





})

module.exports = router;




