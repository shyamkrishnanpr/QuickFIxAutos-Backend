import { set, connect } from 'mongoose'

const db = async()=>{
    try {
        set('strictQuery',true)  
    const db = await
         connect(process.env.MONG_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
         })
        .then(()=>{
            console.log("Database connected successfully")
         })
         

    } catch (error) {
        
    }
}

export default db;