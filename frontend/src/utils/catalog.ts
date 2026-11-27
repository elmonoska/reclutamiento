import type { TCatalog } from "../types/api.type";

export function getCatalogName(items: TCatalog[], id: number) {
    return items.find((item) => item.id === id)?.name ?? `ID ${id}`;
}

