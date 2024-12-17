// errorHandler.js (place it in the middleware or utils folder)

const errorHandler = (err, req, res, next) => {
    // ValidationError (Mongoose)
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, errors });
    }

    // JWT Token Errors (e.g., invalid or expired token)
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    // CastError (invalid ObjectId in MongoDB)
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: `Invalid ID format: ${err.value}` });
    }

    // Handling other types of errors
    console.error(err); // Log the error stack for debugging
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong on the server.',
    });
};

export default errorHandler