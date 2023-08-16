import multer from 'multer'
import path from 'path'
import fs from 'fs'



const storage = multer.diskStorage({
    destination:function(req,file,cb){
       cb(null,'public/vehicleImages')
    },
    filename:function(req,file,cb){
        cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname) )
    }
})

const multerFilter = (req, file, cb) => {

    if (file.mimetype.split('/')[1] === 'jpeg' ||
      file.mimetype.split('/')[1] === 'png' ||
      file.mimetype.split('/')[1] === 'jpg') {
      cb(null, true);
    } else {
      cb(new Error("Not a JPEG, PNG or JPG File!!"), false);
    }
  }


const upload = multer({ storage: storage ,fileFilter:multerFilter });

export{
    upload
}