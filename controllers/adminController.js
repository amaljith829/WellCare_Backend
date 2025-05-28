import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctormodel.js';
import jwt from 'jsonwebtoken';


//API for adding doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;
        
        //checking if all required fields are present
         if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.json({ success:false, message: "All fields are required" });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        //validating strong password
        if( !validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0
        })) {
            return res.json({ success: false, message: "Please Enter a Strong Password." });
        }

        //hashing password
         const salt= await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

        //uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'});
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address), // Assuming address is a JSON string
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: "Doctor added successfully"});


    } catch (error) {
        console.error("Error adding doctor:", error);
        res.json({ success: false, message:error.message });

    }}

    //API for admin login

    const adminLogin = async (req, res) => {
        try{
            const { email,password } = req.body;

            if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD) {

                const token= jwt.sign( email+password , process.env.JWT_SECRET);
                res.json({ success: true, token });

            }else {
                return res.json({ success: false, message: "Invalid email or password" });
            }

        }catch(error) {
            console.error("Error logging in admin:", error);
            res.json({ success: false, message: error.message });
        }
    }

    export {addDoctor, adminLogin};