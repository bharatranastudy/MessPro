export const errorHandler = (err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err.message || err)
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        message
    })
}

export default errorHandler
