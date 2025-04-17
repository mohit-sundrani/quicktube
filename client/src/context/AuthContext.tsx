import { createContext } from "react";
import { User } from "../lib/types";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    signin: (credentials: { email: string; password: string }) => Promise<void>;
    signup: (credentials: { name: string; email: string; password: string }) => Promise<void>;
    signout: () => void;
    isAuthLoading: boolean;
    authError: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
