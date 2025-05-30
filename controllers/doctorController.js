import doctorModel from '../models/doctorModel.js';


const changeAvailability = async (req, res) => {
    try{
        const {docId} =req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {available: !docData.available})
        res.json({sucess:true,message:'availability changed successfully'})
    }catch(error){
        console.log(error);
        res.json({success:false,messaqge:error.message})
    }
}

export {changeAvailability}