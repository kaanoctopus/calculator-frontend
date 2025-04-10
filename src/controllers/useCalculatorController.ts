import { useState, useCallback } from "react";
import {
    evaluateExpression,
    fetchHistory,
    clearHistory,
} from "../services/calculatorService";
import {
    isValidInput,
    transformSpecialInput,
    transformForEvaluation,
    isOperator,
    isPostOperator,
} from "../utils/inputUtils";
import { HistoryItem, UseCalculatorControllerReturn } from "../types";

export function useCalculatorController(): UseCalculatorControllerReturn {
    const [expression, setExpression] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [justCalculated, setJustCalculated] = useState<boolean>(false);

    const loadHistory = useCallback(async (): Promise<void> => {
        try {
            const { history: historyData } = await fetchHistory();
            setHistory(
                historyData.map(
                    (h: HistoryItem) => `${h.expression} = ${h.result}`
                )
            );
        } catch (error) {
            console.error("Failed to load history:", error);
        }
    }, []);

    const handleKeyPress = async (key: string): Promise<void> => {
        const isClear = key.toLowerCase() === "c";

        if (!isClear && !isValidInput(expression, key)) return;

        const transformedKey = transformSpecialInput(key);

        if (key === "=") {
            try {
                const transformedExpr = transformForEvaluation(expression);
                const res = await evaluateExpression(transformedExpr);
                setResult(res);
                setExpression(res);
                setHistory([`${expression} = ${res}`, ...history]);
                setJustCalculated(true);
            } catch {
                setResult("Error");
                setExpression("");
            }
        } else if (isClear) {
            setExpression("");
            setResult("");
        } else {
            if (justCalculated) {
                const newExpr =
                    isOperator(key) || isPostOperator(key)
                        ? result + transformedKey
                        : transformedKey;
                setExpression(newExpr);
                setJustCalculated(false);
            } else {
                setExpression((prev) => prev + transformedKey);
            }
            setResult("");
        }
    };

    const handleClearHistory = async (): Promise<void> => {
        try {
            await clearHistory();
            setHistory([]);
        } catch (err) {
            console.error("Failed to clear history:", err);
        }
    };

    return {
        expression,
        result,
        history,
        handleKeyPress,
        handleClearHistory,
        loadHistory,
    };
}
