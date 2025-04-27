import { SignUpInput } from "@het4399/common";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { motion } from "framer-motion";
import { LabelInput } from "./Auth";

 export const Auth2 = () => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignUpInput>({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false); // Tracks button loading state
    const [usernameError, setUsernameError] = useState<string | null>(null); // Username error message
    const [passwordError, setPasswordError] = useState<string | null>(null); // Password error message
    const [signinError, setSigninError] = useState<string | null>(null); // Generic sign-in error

    async function sendRequest() {
        setIsLoading(true);
        setUsernameError(null);
        setPasswordError(null);
        setSigninError(null);

        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/users/signin`, postInputs);
            localStorage.setItem("token", res.data.token);
            navigate("/blogs");
        } catch (e: any) {
            if (e.response?.data?.message === "User Not found") setUsernameError("User not found");
            else if (e.response?.data?.message === "Invalid password") setPasswordError("Incorrect password");
            else setSigninError("Sign-in Failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div className="w-full max-w-lg p-6 md:p-8 bg-[#1e293b]/50 backdrop-blur-2xl rounded-2xl shadow-lg text-white mx-auto"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

            {/* About Page Link */}
            <Link to={'/about'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 ml-auto text-indigo-200 transition duration-400 hover:scale-110 hover:text-indigo-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            </Link>

            {/* Loading Bar */}
            {isLoading && (
                <motion.div className="fixed top-0 left-0 w-full h-1 bg-indigo-500 z-50"
                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            )}

            {/* logo in the center */}
            <div className="mx-auto flex justify-center items-center w-14 h-14 border-2 border-indigo-400 rounded-full  mb-2">
                <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-12 h-12 object-contain"
                />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-extrabold pb-1 bg-gradient-to-b from-blue-600/95 via-blue-200 to-white/90 text-transparent bg-clip-text text-center">BlogBox</h1>

            {/* Signup Link */}
            <p className="text-gray-400 text-sm mt-2 text-center">
                Don't have an account? <Link to="/signup" className="text-indigo-500 font-semibold hover:underline">Sign up</Link>
            </p>

            {/* Input Fields */}
            <div className="mt-5 space-y-5">
                <LabelInput label="Email" placeholder="example@gmail.com"
                    onchange={(e) => setPostInputs({ ...postInputs, email: e.target.value })} />
                {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}

                <LabelInput label="Password" type="password" placeholder="********"
                    onchange={(e) => setPostInputs({ ...postInputs, password: e.target.value })} />
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            {signinError && <p className="text-red-500 text-sm mt-3">{signinError}</p>}

            {/* Sign-in Button */}
            <motion.button onClick={sendRequest} className="w-full mt-6 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 focus:outline focus:outline-indigo-400 font-semibold rounded-xl shadow-md transition duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isLoading} style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}>

                {/* Loading Spinner */}
                {isLoading && (
                    <svg className="animate-spin size-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 16 0h-2a6 6 0 1 0-12 0H4z"></path>
                    </svg>
                )}
                Sign In
            </motion.button>
            {/* About Us */}
            <motion.div className="mt-4 text-center text-xs text-gray-400"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p>© 2025 BlogBox. All rights reserved.</p>
                <Link to="/about" className="text-indigo-400 hover:underline">About Us</Link>
            </motion.div>
        </motion.div>
    );
};
