'use client';

import { Liff } from "@line/liff";
import React, { useEffect, useState } from "react";

interface LiffContextType {
    liff: Liff | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: Error | null;
    login: () => Promise<void>;
    logout: () => void;
}

const LiffContext = React.createContext<LiffContextType | null>(null);

export function useLiff() {
    const context = React.useContext(LiffContext);
    if (!context) {
        throw new Error("useLiff must be used within a LiffProvider");
    }
    return context;
}

export function LiffProvider({ children }: { children: React.ReactNode }) {
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // to avoid `window is not defined` error
        import("@line/liff")
            .then((liff) => liff.default)
            .then((liff) => {
                console.log("LIFF init...");
                liff
                    .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
                    .then(() => {
                        console.log("LIFF init succeeded.");
                        setLiffObject(liff);
                        // Check if user is logged in
                        const isInClient = liff.isInClient();
                        const isLoggedIn = liff.isLoggedIn();
                        setIsLoggedIn(isLoggedIn);
                        
                        // If in LINE browser, user is already logged in
                        // If in external browser and not logged in, we don't auto-login
                        console.log("Is in LINE browser:", isInClient);
                        console.log("Is logged in:", isLoggedIn);
                    })
                    .catch((error: Error) => {
                        console.error("LIFF init failed.", error);
                        setError(error);
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            });
    }, []);

    const login = async () => {
        if (!liffObject) return;
        try {
            if (!liffObject.isLoggedIn()) {
                await liffObject.login();
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error("Login failed:", error);
            setError(error as Error);
        }
    };

    const logout = () => {
        if (!liffObject) return;
        try {
            liffObject.logout();
            setIsLoggedIn(false);
        } catch (error) {
            console.error("Logout failed:", error);
            setError(error as Error);
        }
    };

    const contextValue: LiffContextType = {
        liff: liffObject,
        isLoggedIn,
        isLoading,
        error,
        login,
        logout
    };

    return (
        <LiffContext.Provider value={contextValue}>
            {children}
        </LiffContext.Provider>
    );
}