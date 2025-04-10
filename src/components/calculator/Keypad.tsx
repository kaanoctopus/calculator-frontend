import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { KeypadProps } from "../../types";

const NUMBER_COLOR = "bg-white";
const OPERATOR_COLOR = "bg-gray-200";
const SCIENCE_OPERATOR_COLOR = "bg-gray-500 text-white";
const RESET_COLOR = "bg-red-500 text-white";
const RESULT_COLOR = "bg-blue-500 text-white";

export default function Keypad({ onKeyPress }: KeypadProps) {
    const [disableAnimations, setDisableAnimations] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent): void => {
            if (e.key === "Enter") {
                setDisableAnimations(true);
                setTimeout(() => setDisableAnimations(false), 100);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const keys = [
        { value: "sin", color: SCIENCE_OPERATOR_COLOR },
        { value: "cos", color: SCIENCE_OPERATOR_COLOR },
        { value: "tan", color: SCIENCE_OPERATOR_COLOR },
        { value: "π", color: SCIENCE_OPERATOR_COLOR },
        { value: "log", color: SCIENCE_OPERATOR_COLOR },
        { value: "^", color: SCIENCE_OPERATOR_COLOR },
        { value: "√", color: SCIENCE_OPERATOR_COLOR },
        { value: "!", color: SCIENCE_OPERATOR_COLOR },
        { value: "c", color: RESET_COLOR },
        { value: "(", color: OPERATOR_COLOR },
        { value: ")", color: OPERATOR_COLOR },
        { value: "/", color: OPERATOR_COLOR },
        { value: "7", color: NUMBER_COLOR },
        { value: "8", color: NUMBER_COLOR },
        { value: "9", color: NUMBER_COLOR },
        { value: "*", color: OPERATOR_COLOR },
        { value: "4", color: NUMBER_COLOR },
        { value: "5", color: NUMBER_COLOR },
        { value: "6", color: NUMBER_COLOR },
        { value: "-", color: OPERATOR_COLOR },
        { value: "1", color: NUMBER_COLOR },
        { value: "2", color: NUMBER_COLOR },
        { value: "3", color: NUMBER_COLOR },
        {
            value: "+",
            color: OPERATOR_COLOR,
            className: "row-span-2",
        },
        { value: "0", color: NUMBER_COLOR },
        { value: ".", color: NUMBER_COLOR },
        { value: "=", color: RESULT_COLOR },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-b-2xl shadow-md"
        >
            {keys.map((key) => (
                <motion.button
                    key={key.value}
                    whileTap={disableAnimations ? {} : { scale: 0.9 }}
                    className={`p-4 rounded-xl shadow hover:bg-opacity-50 text-xl font-medium ${
                        key.color
                    } ${key.className || ""}`}
                    onClick={() => onKeyPress(key.value)}
                >
                    {key.value}
                </motion.button>
            ))}
        </motion.div>
    );
}
