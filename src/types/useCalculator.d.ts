export type Transformations = { [key: string]: string };

export type HistoryItem = {
    expression: string;
    result: string;
};

export type UseCalculatorControllerReturn = {
    expression: string;
    result: string;
    history: string[];
    handleKeyPress: (key: string) => Promise<void>;
    handleClearHistory: () => Promise<void>;
    loadHistory: () => Promise<void>;
};