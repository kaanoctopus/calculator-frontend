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
