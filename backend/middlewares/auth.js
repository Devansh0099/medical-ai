const { validateToken } = require("../services/authentication");

function checkForAuth(cookie) {
    return (req, res, next) => {

        console.log("Cookies:", req.cookies);

        const token = req.cookies[cookie];

        console.log("Token:", token);

        if (!token) {
            req.user = null;
            return next();
        }

        try {
            const user = validateToken(token);
            console.log("Decoded User:", user);
            req.user = user;
        } catch (error) {
            console.log("JWT Error:", error.message);
            res.clearCookie("token");
        }

        next();
    };
}

module.exports = checkForAuth;