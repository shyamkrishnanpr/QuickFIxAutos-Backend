
import jwt from 'jsonwebtoken'
import CategoryModel from '../models/categorySchema.js'
import SubCategoryModel from '../models/subCategorySchema.js';
import VehicleModel from '../models/vehicleSchema.js';
import UserModel from '../models/userSchema.js';
import { response } from 'express';
import fs from 'fs'


//admin login controller
const login = (req,res,next)=>{
    try {
        const {email,password} = req.body

        console.log(req.body)
        if (email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD) {
            const payload = {
                email:email
            }
           
            jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:3600
            },
            
            (err,token)=>{
                console.log(token)
                if (err) {
                    console.log("There is some error in token")
                } else {
                    res.json({
                        status:true,
                        email:email,
                        token:`Bearer ${token}`
                    })
                }
            })
        } else {
            console.log("Incorrect password or email")
        }
        
    } catch (error) {
        console.log(error)
    }
}; 

//category management controller


const Category = async(req,res,next)=>{
    try {

      const category= await CategoryModel.find()
      res.json( 
        category
      )
    } catch (error) {
        console.log(error)
    }
}

const addCategory = async(req,res,next)=>{
    try {
        const category = req.body
    console.log(category)
    CategoryModel.create(category)
    res.json(
        category
    )
    } catch (error) {
        console.log(error)
    }
}

const editCategory = async(req,res,next)=>{
    try {
        const id = req.params.id
        const {newName} = req.body
        const category = await CategoryModel.findByIdAndUpdate(
            id,
            {category:newName},
            { new: true }
        )
        return(
            response
        ) 
    } catch (error) {
        console.log(error)
    }
}


const deleteCategory = async(req,res,next)=>{
    try {
        const id = req.params.id;
        console.log(id)
         await CategoryModel.findByIdAndDelete({_id:id})
        res.json(
         response
        )
    } catch (error) {
        console.log(error)
    }
 
}

//subCategory management controller

const subCategory = async(req,res,next)=>{
    try {
        const subCategory = await SubCategoryModel.find()
        res.json(
            subCategory
        )

    } catch (error) {
        console.log(error)
    }
}


const addSubCategory = async(req,res,next)=>{
    try {
        const subCategory = req.body
        console.log(subCategory)
    SubCategoryModel.create(subCategory)
    res.json(
        subCategory
    )
    } catch (error) {
        console.log(error)
    }  
}


const deleteSubCategory = async(req,res,next)=>{
    try {
        const id = req.params.id
        await SubCategoryModel.findByIdAndDelete({_id:id})
        res.json(
            response
        )  
    } catch (error) {
        console.log(error)
    }
}

  
const editSubCategory = async(req,res,next)=>{
    try {
        const id = req.params.id
        const {newName} = req.body
        const subCategory = await SubCategoryModel.findByIdAndUpdate(
            id,
            {subCategory:newName},
            { new: true }
            )
            return(
                response
            )
        
    } catch (error) {
        console.log(error)
    }
}


// Vehicle management controller

const vehicles = async(req,res,next)=>{
    try {
        const vehicles = await VehicleModel.find()

        res.json(
            vehicles
        )
    } catch (error) {
        console.log(error)
    }
}


const addVehicle = async(req,res,next)=>{
    try {
        const vehicle = req.body
        console.log(vehicle)
        vehicle.image = req.file.filename;
        console.log(vehicle.image)
         await VehicleModel.create(vehicle)
        res.json(
            vehicle
        )
    } catch (error) {
        console.log(error)
    }
}

const deleteVehicle = async(req,res,next)=>{
    try {
        const id = req.params.id
        
        await VehicleModel.findByIdAndDelete({_id:id})
        res.json(
            response
        )  
    } catch (error) {
        console.log(error)
    }
}

const fetchUsers = async(req,res,next)=>{
    try {
        const users = await UserModel.find()
        res.json(
            users
        )
        
    } catch (error) {
        console.log(error)
    }
}


export{
    login,
    Category,
    addCategory,
    editCategory,
    deleteCategory,
    subCategory,
    addSubCategory,
    deleteSubCategory,
    editSubCategory,
    addVehicle,
    vehicles,
    deleteVehicle,
    fetchUsers
}
