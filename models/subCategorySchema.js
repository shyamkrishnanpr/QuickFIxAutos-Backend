import mongoose from "mongoose";
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    subCategory:{
        type:String
    },
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:'category'
    }
   

})

const SubCategoryModel = mongoose.model("subCategory",subCategorySchema);
export default SubCategoryModel

