import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {v2 as cloudinary} from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: 'dh6hcdlzi',
  api_key: '255722798928367',
  api_secret: 'Rw4VJYTXI3JcgCOGHDf6gqkQZcQ',
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "QuickFixAutos",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const fileFilter = (req, file, cb) => {
  if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    return cb(new Error("File is not an image"));
  }
  return cb(null, true);
};





// const storage = multer.diskStorage({
//     destination:function(req,file,cb){
//        cb(null,'public/vehicleImages')
//     },
//     filename:function(req,file,cb){
//         cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname) )
//     }
// })


// const multerFilter = (req, file, cb) => {

//     if (file.mimetype.split('/')[1] === 'jpeg' ||
//       file.mimetype.split('/')[1] === 'png' ||
//       file.mimetype.split('/')[1] === 'jpg') {
//       cb(null, true);
//     } else {
//       cb(new Error("Not a JPEG, PNG or JPG File!!"), false);
//     }
//   }


const upload = multer({storage ,fileFilter });


const uploadImage = (req, res, next) => {

  

  upload.single('image')(req, res, (err) => {
    console.log("req")
    if (err) {
      console.error(err);
      if (err.message === "File is not an image") {
        console.log('Selected file is not an image')
        return res.status(400).json({ error: 'Selected file is not an image' });
      }
      console.log('An error occurred during file upload');
      return res.status(500).json({ error: 'An error occurred during file upload' });
    }
    console.log("reached to cloudinary")

   return next();
  });
};


export default uploadImage

// export{
//     upload
// }