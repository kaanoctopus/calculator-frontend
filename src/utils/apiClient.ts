const BACKUP_API_BASE: string =
    "https://splendorous-pasca-035b17.netlify.app/api";
const PRIMARY_API_BASE: string =
    "https://splendorous-pasca-035b17.netlify.app/api";
const AUTH_ENDPOINT: string = "/auth";
const FAILOVER_DURATION: number = 5 * 60 * 1000; // 5 minutes in milliseconds

let primaryAPIFailedAt: number | null = null;

export const getAuthHeaders = (): Record<string, string> => {
    const token: string | null = localStorage.getItem("token");
    return token
        ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          }
        : { "Content-Type": "application/json" };
};

async function tryAPI(
    baseUrl: string,
    endpoint: string,
    options: RequestInit
): Promise<any> {
    const response: Response = await fetch(`${baseUrl}${endpoint}`, options);
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export async function fetchWithFallback(
    endpoint: string,
    options: RequestInit,
    isAuthEndpoint: boolean = false
): Promise<any> {
    const primaryBase: string = isAuthEndpoint
        ? `${PRIMARY_API_BASE}${AUTH_ENDPOINT}`
        : PRIMARY_API_BASE;
    const backupBase: string = isAuthEndpoint
        ? `${BACKUP_API_BASE}${AUTH_ENDPOINT}`
        : BACKUP_API_BASE;

    const now: number = Date.now();
    const isInFailover: boolean =
        primaryAPIFailedAt !== null &&
        now - primaryAPIFailedAt < FAILOVER_DURATION;

    if (!isInFailover) {
        try {
            const result: any = await tryAPI(primaryBase, endpoint, options);
            if (primaryAPIFailedAt) {
                console.log("Primary API recovered, exiting failover mode");
                primaryAPIFailedAt = null;
            }
            return result;
        } catch (primaryError: any) {
            console.warn(
                "Primary API failed, entering failover mode",
                primaryError
            );
            primaryAPIFailedAt = now;
        }
    } else {
        console.log(
            `In failover mode (${
                primaryAPIFailedAt !== null
                    ? Math.round(
                          (FAILOVER_DURATION - (now - primaryAPIFailedAt)) /
                              1000
                      )
                    : 0
            }s remaining)`
        );
    }

    try {
        return await tryAPI(backupBase, endpoint, options);
    } catch (backupError: any) {
        console.error("Backup API failed:", backupError);
        throw new Error(`Both APIs failed: ${backupError.message}`);
    }
}
