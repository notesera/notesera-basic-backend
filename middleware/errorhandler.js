// here i will handle exceptions :- not found , any error like email not coorect or email already exist 
//not found 
const notfound = (req,res,next)=>{
    const error = new Error(`notfound: ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// error handling
const errorhandler = (err,req,res,next)=>{
    const statuscode = res.statusCode == 200?500: res.statusCode;
    res.status(statuscode);
    res.json({
        message:err?.message,
        stack: err?.stack
    });
};
module.exports = {errorhandler,notfound};