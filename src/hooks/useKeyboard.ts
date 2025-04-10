import { useEffect } from "react";
import { HandleKeyPress, KeyboardEventHandler } from "../types";


export default function useKeyboard(handleKeyPress: HandleKeyPress): void {
    useEffect(() => {
        const handleKeyDown: KeyboardEventHandler = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleKeyPress("=");
                return;
            }

            const validKeys = "cC()0123456789/*-+.=!";
            if (validKeys.includes(e.key)) {
                handleKeyPress(e.key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyPress]);
}
