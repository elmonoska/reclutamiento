import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { verifySesion } from "../api/auth";

type TAuthContext = {
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
}

type TAuthProvider = {
    children: ReactNode;
}

const AuthContext = createContext<TAuthContext | undefined>(undefined);

export function AuthProvider({ children }: TAuthProvider) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    async function checkAuth() {
        setIsLoading(true);
        try {
            await verifySesion();
            setIsAuthenticated(true);
        } catch (err) {
            console.error(err);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (ctx === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return ctx;
}