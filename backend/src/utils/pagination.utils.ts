export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

export function getPagination(query: any, defaultLimit = DEFAULT_PAGE_SIZE) {
    const page = Math.max(parseInt(query.page as string) || DEFAULT_PAGE, 1);
    const limit = Math.max(parseInt(query.limit as string) || defaultLimit, 1);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}

export function getTotalPages(count: number, limit: number) {
    return Math.max(Math.ceil(count / limit), 1);
}
