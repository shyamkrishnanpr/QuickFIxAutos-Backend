import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bannerSchema = new Schema({
    bannerImage:{
        type:String
    },
    bannerImages:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }

        }
    ]
})

const BannerModel = mongoose.model("banner",bannerSchema)
export default BannerModel