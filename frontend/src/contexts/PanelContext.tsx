import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCatalogs } from "../api/job-posting";
import type { TApiResponseCatalogs } from "../types/api.type";

type TPanelContext = {
    catalogs: TApiResponseCatalogs;
    isLoadingCatalogs: boolean;
    refreshCatalogs: () => Promise<void>;
};

type TPanelProvider = {
    children: ReactNode;
};

const initialCatalogs: TApiResponseCatalogs = {
    educationLevels: [],
    employmentTypes: [],
    experienceLevels: [],
    jobCategories: [],
    states: [],
    workModels: [],
};

const PanelContext = createContext<TPanelContext | undefined>(undefined);

export function PanelProvider({ children }: TPanelProvider) {
    const [catalogs, setCatalogs] = useState<TApiResponseCatalogs>(initialCatalogs);
    const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

    async function refreshCatalogs() {
        setIsLoadingCatalogs(true);
        const res = await getCatalogs();
        if (res.success) {
            setCatalogs(res.data);
        }
        setIsLoadingCatalogs(false);
    }

    useEffect(() => {
        refreshCatalogs();
    }, []);

    return (
        <PanelContext.Provider value={{ catalogs, isLoadingCatalogs, refreshCatalogs }}>
            {children}
        </PanelContext.Provider>
    );
}

export function usePanel() {
    const ctx = useContext(PanelContext);
    if (ctx === undefined) {
        throw new Error("usePanel debe usarse dentro de un PanelProvider");
    }
    return ctx;
}
