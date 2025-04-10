import { OPERATORS, SPECIAL_FUNCTIONS, POST_OPERATORS } from "./inputUtils";

export const isOperator = (key: string): boolean => OPERATORS.includes(key);
export const isSpecialFunction = (key: string): boolean =>
    SPECIAL_FUNCTIONS.includes(key);
export const isPostOperator = (key: string): boolean =>
    POST_OPERATORS.includes(key);

export const countChar = (str: string, char: string): number =>
    (str.match(new RegExp(`\\${char}`, "g")) || []).length;

export const validateEquals = (expr: string, lastChar: string): boolean => {
    if (!expr || isOperator(lastChar)) return false;

    const hasValidContent = expr.length > 0;
    const openParens = countChar(expr, "(");
    const closeParens = countChar(expr, ")");
    return hasValidContent && openParens === closeParens;
};

export const validateClosingParen = (
    expr: string,
    lastChar: string
): boolean => {
    const open = countChar(expr, "(");
    const close = countChar(expr, ")");
    return open > close && !isOperator(lastChar) && lastChar !== "(";
};

export const validateOperatorChaining = (
    lastChar: string,
    newKey: string
): boolean => {
    const isChainingAllowed =
        (lastChar === "*" || lastChar === "/") && newKey === "-";
    return !isChainingAllowed && isOperator(lastChar) && isOperator(newKey);
};

export const isInvalidLeadingOperator = (expr: string, key: string): boolean =>
    !expr &&
    (isOperator(key) || isSpecialFunction(key) || isPostOperator(key)) &&
    key !== "-";

export const isInvalidAfterOpenParen = (
    lastChar: string,
    key: string
): boolean => lastChar === "(" && isOperator(key) && key !== "-";

export const validateDecimalPoint = (expr: string): boolean => {
    const parts = expr.split(/[+\-*/()^!]/);
    const lastNum = parts[parts.length - 1];
    return !lastNum.includes(".");
};

export const validatePostOperator = (expr: string): boolean => {
    const lastChar = expr.slice(-1);
    return /[0-9)]/.test(lastChar);
};
