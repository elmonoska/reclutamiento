import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { verifySesion } from "../api/auth";
import type { TUser } from "../types/auth.type";

type TAuthContext = {
    isAuthenticated: boolean;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
    user: TUser | null;
    setUser: Dispatch<SetStateAction<TUser | null>>;
}

type TAuthProvider = {
    children: ReactNode;
}

const AuthContext = createContext<TAuthContext | undefined>(undefined);

export function AuthProvider({ children }: TAuthProvider) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<TUser | null>(null)

    async function checkAuth() {
        setIsLoading(true);
        try {
            const res = await verifySesion();
            if (res.success) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            } 
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
        <AuthContext.Provider value={{ isAuthenticated, isLoading, checkAuth, user, setUser }}>
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