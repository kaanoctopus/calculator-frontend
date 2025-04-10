import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import { AuthPageProps } from "../../types";

export default function AuthPage({ onLogin }: AuthPageProps) {
    const [currentPage, setCurrentPage] = useState<"login" | "register">(
        "login"
    );

    const switchToLogin = (): void => setCurrentPage("login");
    const switchToRegister = (): void => setCurrentPage("register");

    return (
        <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
                {currentPage === "login" ? (
                    <motion.div
                        key="login"
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Login
                            onLogin={onLogin}
                            onSwitchToRegister={switchToRegister}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Register onSwitchToLogin={switchToLogin} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
