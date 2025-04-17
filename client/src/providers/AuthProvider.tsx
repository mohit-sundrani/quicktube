import { useState, useEffect, ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { User } from "../lib/types";
import isCustomError from "../lib/customError";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = authService.getToken();
            if (token) {
                try {
                    const userData = await authService.verifyToken(token);
                    if (userData) {
                        setIsAuthenticated(true);
                        setUser(userData.user as User);
                    }
                } catch (error) {
                    if (isCustomError(error)) {
                        setAuthError(error.message);
                    } else {
                        setAuthError("Something went wrong");
                    }
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setIsAuthLoading(false);
        };
        checkAuth();
    }, [navigate]);

    const signin = async (credentials: { email: string; password: string }) => {
        try {
            const res = await authService.signin(credentials);
            setIsAuthenticated(true);
            setUser(res.user);
            setAuthError(null);
        } catch (error) {
            if (isCustomError(error)) {
                setAuthError(error.message);
            } else {
                setAuthError("Something went wrong");
            }
        }
    };

    const signup = async (credentials: { name: string; email: string; password: string }) => {
        try {
            const res = await authService.signup(credentials);
            setIsAuthenticated(true);
            setUser(res.user);
            setAuthError(null);
        } catch (error) {
            if (isCustomError(error)) {
                setAuthError(error.message);
            } else {
                setAuthError("Something went wrong");
            }
        }
    };

    const signout = () => {
        try {
            authService.signout();
            setIsAuthenticated(false);
            setUser(null);
            setAuthError(null);
        } catch (error) {
            console.error("Signout failed:", error);
            setAuthError("Signout failed");
        }
    };

    return (
        <AuthContext
            value={{
                isAuthenticated,
                user,
                signin,
                signup,
                signout,
                isAuthLoading,
                authError,
            }}>
            {children}
        </AuthContext>
    );
};
