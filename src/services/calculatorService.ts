import { fetchWithFallback, getAuthHeaders } from "../utils/apiClient";

export async function evaluateExpression(expression: string): Promise<string> {
    const data = await fetchWithFallback("/calculate", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ expression }),
    });
    return data.result;
}

export async function fetchHistory() {
    return await fetchWithFallback("/history", {
        method: "GET",
        headers: getAuthHeaders(),
    });
}

export async function clearHistory() {
    await fetchWithFallback("/history", {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
}
