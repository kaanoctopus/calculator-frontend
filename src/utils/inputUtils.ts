import { Transformations } from "../types";
import {
    isOperator,
    isSpecialFunction,
    isPostOperator,
    validateEquals,
    validateClosingParen,
    validateOperatorChaining,
    isInvalidLeadingOperator,
    isInvalidAfterOpenParen,
    validateDecimalPoint,
    validatePostOperator,
} from "./validationUtils";

export const OPERATORS: string[] = ["+", "-", "*", "/", "="];
export const SPECIAL_FUNCTIONS: string[] = ["sin", "cos", "tan", "sqrt", "log"];
export const POST_OPERATORS: string[] = ["!", "^"];

export { isOperator, isSpecialFunction, isPostOperator };

export const transformSpecialInput = (key: string): string => {
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

// This function takes a mathematical expression as a string and transforms it into a format suitable for evaluation.
// It iterates through the expression character by character, checking if the current character represents a function call (e.g., sin, cos).
// If a function call is detected, it extracts the inner expression within the parentheses, recursively transforms it, and appends it to the result.
// Otherwise, it appends the current character to the result as is.
// The function ensures that nested function calls are properly handled and transformed.
// Step-by-step example:
// 1. Input: "sin(cos(90) * 2)"
//    - The function starts iterating through the string.
// 2. Detects "sin(":
//    - Recognizes it as a function call.
//    - Extracts the inner expression "cos(90) * 2".
// 3. Processes "cos(90)":
//    - Recognizes "cos(" as a function call.
//    - Extracts the inner expression "90".
//    - Recursively transforms "90" (no further transformation needed).
//    - Appends "cos(90 deg)" to the result.
// 4. Multiplies by 2:
//    - Appends " * 2" to the result.
// 5. Completes "sin(":
//    - Wraps the transformed inner expression "cos(90 deg) * 2" with "sin(" and adds its own deg.
// 6. Final Output: "sin(cos(90 deg) * 2 deg)"
export const transformForEvaluation = (expr: string): string => {
    let result = "";
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

// co"s(", si"n("
const isFunctionCall = (expr: string, i: number): boolean => {
    return (expr[i] === "s" || expr[i] === "n") && expr[i + 1] === "(";
};

const extractInnerExpression = (
    expr: string,
    startIndex: number
): { inner: string; nextIndex: number } => {
    let count = 1;
    let inner = "";
    let i = startIndex + 2;

    while (i < expr.length && count > 0) {
        if (expr[i] === "(") count++;
        else if (expr[i] === ")") count--;

        if (count > 0) inner += expr[i];
        i++;
    }

    return { inner, nextIndex: i };
};

const transformFunctionCall = (funcName: string, inner: string): string => {
    return `${funcName}(${transformForEvaluation(inner)} deg)`;
};

export const isValidInput = (expr: string, key: string): boolean => {
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
