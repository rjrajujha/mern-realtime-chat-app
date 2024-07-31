const validUser = (req, res, next) => {
    const { email, password } = req.body;

    // Check if email is provided and is a valid email format
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            status: "failed",
            message: "A valid email address is required."
        });
    }

    // Check if password is provided and meets length requirements
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({
            status: "failed",
            message: "Password is required and must be at least 6 characters long."
        });
    }

    // If validation passes, proceed to the next middleware
    next();
};

export default validUser;
