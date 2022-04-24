const { CustomError } = require("../customError");

////middleware to handle unexpected errors and results
const getReqEnv=(moduleToRun)=>async (req,res)=>{

    try {
        let result =await moduleToRun(req.query);
        res.status(result[0]).json(result[1])
    }
    catch (error) {
        if (error instanceof CustomError) {
            console.log(error.message);
        }
        res.status(500).json({
            message: "Something Went Wrong!"
        });
    }
}
module.exports = {
    getReqEnv
} 