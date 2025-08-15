import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },            
  description: { type: String, required: true, trim: true },      
  details: { type: String },                                      
  price: { type: Number, required: true, min: 0 },                
  quantity: { type: Number, required: true, min: 0 },             
  image: { type: String, default: '' },                         
  images: [{ type: String }],                                     
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', required: true },                    
  slug: { type: String, required: true, unique: true },           
  isFeatured: { type: Boolean, default: false },                  
  createdAt: { type: Date, default: Date.now }                    
});

const Product = mongoose.model('Product', productSchema);
export default Product;
