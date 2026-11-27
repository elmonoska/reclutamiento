export function getExpirationTime(minutes: number): { cookieMs: number, jwtString: number } {
    return {
        cookieMs: minutes * 60 * 1000,
        jwtString: minutes  * 60
    }
}