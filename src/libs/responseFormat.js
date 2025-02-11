const successResponse = (res, data, message = "Request successful", statusCode = 200) => {
    res.status(statusCode).json({
        status: "success",
        message,
        data,
    });
};

const errorResponse = (res, error, message = "Request failed", statusCode = 500) => {
    if (error==null){
       return res.status(statusCode).json({
            status:"error",
            message,
        });  
    }
    res.status(statusCode).json({
        status:"error",
        message,
        error,
    });
};

module.exports = {
    successResponse,
    errorResponse,
};
