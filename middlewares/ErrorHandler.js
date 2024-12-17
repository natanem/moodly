const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Handle different types of errors here (validation, server errors, etc.)
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
    }
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid ID format" });
    }

    res.status(500).json({ message: "Internal server error" });
};

export default errorHandler;