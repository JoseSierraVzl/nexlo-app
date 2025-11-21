// src/index.ts
import express from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";

const app = express();
const port = 4000;
app.use(express.json());

// ------------------------
// SIGN-UP (server-side)
// ------------------------
app.post("/api/auth/sign-up", async (req, res) => {
    const { email, password, name } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    try {
        // Método server-side
        const response = await auth.api.signUpEmail({
            body: { email, password, name },
            asResponse: true // devuelve objeto tipo Response
        });

        // Better Auth puede devolver redirect o JSON
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err: any) {
        console.error("Sign-up error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ------------------------
// SIGN-IN (server-side)
// ------------------------
app.post("/api/auth/sign-in", async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    try {
        const response = await auth.api.signInEmail({
            body: { email, password },
            asResponse: true,
        });
        const data = await response.json();

        // Devuelve las cookies al cliente
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) res.setHeader("Set-Cookie", setCookie);

        res.status(response.status).json(data);
    } catch (err: any) {
        console.error("Sign-in error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ------------------------
// PROFILE (protegido)
// ------------------------
app.get("/api/profile", async (req, res) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers), // ✅ convierte IncomingHttpHeaders a HeadersInit
        });
        console.log("Session:", session);

        if (!session || !session.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        res.json({ user: session.user });
    } catch (err: any) {
        console.error("Profile error:", err);
        res.status(500).json({ error: err.message });
    }
});



// ------------------------
// Ruta de prueba
// ------------------------
app.get("/", (req, res) => {
    res.json({ message: "Server running 🚀" });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
