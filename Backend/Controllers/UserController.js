const UserSchema = require('../Schemas/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpressError =require("../Middleware/ExpressError")
exports.signup = async (req, res,next) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return next(new ExpressError(400,"Please enter all the fields"));
    }

    try {
        const existing_user = await UserSchema.findOne({ email });
        if (existing_user) {
            return next( new ExpressError(400,"User already exist"));

        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const new_user = new UserSchema({ email, username, password: hashedPassword });

        await new_user.save();

        const token = jwt.sign({ id: new_user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: true,
            sameSite: 'lax'
        });

        res.status(201).json({ message: "User signed up successfully", success: true, new_user });

    } catch (error) {
        next(error)
    }
};

exports.login = async (req, res,next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return next(new ExpressError(400,"Please enter all the fields"));

    }

    try {
        const user = await UserSchema.findOne({ username });
        if (!user) {
           return next( new ExpressError(400,"no user exist for this username"))
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
         return next( new ExpressError(400,"Password is incorrect"))
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax'
        });

        res.status(201).json({ message: "Logged in successfully", success: true, user,token });

    } catch (error) {
        console.error(error);
        next( error)
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', { path: '/', sameSite: 'lax' });
    res.status(201).json({ message: "Logged out successfully" });
};

exports.checkAuth = (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("No token found");

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).send("Invalid token");
        res.status(200).send("Authenticated");
    });
};
