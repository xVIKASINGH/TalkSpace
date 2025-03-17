const UserSchema = require('../Schemas/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.json({ success: false, message: "Please enter all fields" });
    }

    try {
        const existing_user = await UserSchema.findOne({ email });
        if (existing_user) {
            return res.json({ success: false, message: "User already exists" });
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
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ success: false, message: "Please enter all the fields" });
    }

    try {
        const user = await UserSchema.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: "No user exists with this username" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.json({ success: false, message: "Password is incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: 'lax'
        });

        res.status(201).json({ message: "Logged in successfully", success: true, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
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
