import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category:{
        type:String
    }
})

const CategoryModel = mongoose.model("category",categorySchema)
export default CategoryModel;