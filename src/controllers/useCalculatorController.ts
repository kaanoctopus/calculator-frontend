import { useState, useCallback } from "react";
import {
    evaluateExpression,
    fetchHistory,
    clearHistory,
} from "../services/calculatorService";
import {Transformations, HistoryItem, UseCalculatorControllerReturn} from "../types";

const OPERATORS: string[] = ["+", "-", "*", "/", "="];
const SPECIAL_FUNCTIONS: string[] = ["sin", "cos", "tan", "sqrt", "log"];
const POST_OPERATORS: string[] = ["!", "^"];


const isOperator = (key: string): boolean => OPERATORS.includes(key);
const isSpecialFunction = (key: string): boolean => SPECIAL_FUNCTIONS.includes(key);
const isPostOperator = (key: string): boolean => POST_OPERATORS.includes(key);

const countChar = (str: string, char: string): number =>
    (str.match(new RegExp(`\\${char}`, "g")) || []).length;

const transformSpecialInput = (key: string): string => {
    const transformations: Transformations = {
        sin: "sin(",
        cos: "cos(",
        tan: "tan(",
        "√": "sqrt(",
        log: "log(",
        π: "pi",
    };
    return transformations[key] || key;
};

const isFunctionCall = (expr: string, i: number): boolean => {
    return (expr[i] === 's' || expr[i] === 'n') && expr[i + 1] === '(';
};

const extractInnerExpression = (expr: string, startIndex: number): { inner: string; nextIndex: number } => {
    let count = 1;
    let inner = '';
    let i = startIndex + 2;

    while (i < expr.length && count > 0) {
        if (expr[i] === '(') count++;
        else if (expr[i] === ')') count--;

        if (count > 0) inner += expr[i];
        i++;
    }

    return { inner, nextIndex: i };
};

const transformFunctionCall = (funcName: string, inner: string): string => {
    return `${funcName}(${transformForEvaluation(inner)} deg)`;
};

const transformForEvaluation = (expr: string): string => {
    let result = '';
    let i = 0;

    while (i < expr.length) {
        if (isFunctionCall(expr, i)) {
            const funcName = expr[i];
            const { inner, nextIndex } = extractInnerExpression(expr, i);
            result += transformFunctionCall(funcName, inner);
            i = nextIndex;
        } else {
            result += expr[i];
            i++;
        }
    }

    return result;
};

const validateEquals = (expr: string, lastChar: string): boolean => {
    if (!expr || isOperator(lastChar)) return false;

    const hasValidContent = expr.length > 0;
    const openParens = countChar(expr, "(");
    const closeParens = countChar(expr, ")");
    return hasValidContent && openParens === closeParens;
};

const validateClosingParen = (expr: string, lastChar: string): boolean => {
    const open = countChar(expr, "(");
    const close = countChar(expr, ")");
    return open > close && !isOperator(lastChar) && lastChar !== "(";
};

const validateOperatorChaining = (lastChar: string, newKey: string): boolean => {
    const isChainingAllowed =
        (lastChar === "*" || lastChar === "/") && newKey === "-";
    return !isChainingAllowed && isOperator(lastChar) && isOperator(newKey);
};

const isInvalidLeadingOperator = (expr: string, key: string): boolean =>
    !expr &&
    (isOperator(key) || isSpecialFunction(key) || isPostOperator(key)) &&
    key !== "-";

const isInvalidAfterOpenParen = (lastChar: string, key: string): boolean =>
    lastChar === "(" && isOperator(key) && key !== "-";

const validateDecimalPoint = (expr: string): boolean => {
    const parts = expr.split(/[+\-*/()^!]/);
    const lastNum = parts[parts.length - 1];
    return !lastNum.includes(".");
};

const validatePostOperator = (expr: string): boolean => {
    const lastChar = expr.slice(-1);
    return /[0-9)]/.test(lastChar);
};

const isValidInput = (expr: string, key: string): boolean => {
    const lastChar = expr.slice(-1);
    if (!lastChar && !isOperator(key)) return true;

    if (key === "=") return validateEquals(expr, lastChar);
    if (key === ")") return validateClosingParen(expr, lastChar);
    if (validateOperatorChaining(lastChar, key)) return false;
    if (isInvalidLeadingOperator(expr, key)) return false;
    if (isInvalidAfterOpenParen(lastChar, key)) return false;
    if (key === "." && !validateDecimalPoint(expr)) return false;
    if (isPostOperator(key) && !validatePostOperator(expr)) return false;

    return true;
};

export function useCalculatorController(): UseCalculatorControllerReturn {
    const [expression, setExpression] = useState<string>("");
    const [result, setResult] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [justCalculated, setJustCalculated] = useState<boolean>(false);

    const loadHistory = useCallback(async (): Promise<void> => {
        try {
            const { history: historyData } = await fetchHistory();
            setHistory(historyData.map((h: HistoryItem) => `${h.expression} = ${h.result}`));
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
