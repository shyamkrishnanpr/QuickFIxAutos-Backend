import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    bannerImage:{
        type:String
    }
})

const BannerModel = mongoose.model("banner",bannerSchema)
export default BannerModel