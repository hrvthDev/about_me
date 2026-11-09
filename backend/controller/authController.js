
const db = require("../db/config.js");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            username.trim().length < 3 ||
            username.length > 50 ||
            email.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            password.length < 8
        ) {
            return res.status(400).json({
                success: false,
                message: "Érvénytelen adatok. A jelszó legalább 8 karakter legyen."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await db.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username.trim(), email.trim().toLowerCase(), passwordHash]
        );

        return res.status(201).json({
            success: true,
            message: "Sikeres regisztráció!"
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "A felhasználónév vagy email már foglalt."
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Szerverhiba történt."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Email és jelszó megadása kötelező."
            });
        }

        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email.trim().toLowerCase()]
        );

        const user = users[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Hibás email vagy jelszó."
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Hibás email vagy jelszó."
            });
        }

    
        return res.status(200).json({
            success: true,
            message: "Sikeres bejelentkezés!",        
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Szerverhiba történt."
        });
    }
};


module.exports = {
    register,
    login,
};
