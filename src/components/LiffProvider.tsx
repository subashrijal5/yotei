'use client';

import { Liff } from "@line/liff";
import React, { useEffect, useState } from "react";

const LiffContext = React.createContext<Liff | null>(null);

export function useLiff() {
    const liff = React.useContext(LiffContext);
    if (!liff) {
        throw new Error("useLiff must be used within a LiffProvider");
    }
    return liff;
}

export function LiffProvider({ children }: { children: React.ReactNode }) {
    const [liffObject, setLiffObject] = useState<Liff | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // to avoid `window is not defined` error
        import("@line/liff")
          .then((liff) => liff.default)
          .then((liff) => {
            console.log("LIFF init...");
            liff
              .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
              .then(() => {
                // liff.login();
                console.log("LIFF init succeeded.");
                setLiffObject(liff);
              })
              .catch((error: Error) => {
                console.log("LIFF init failed.");
                
              }).finally(() => {
                setIsLoading(false);
              });
          });
      }, []);



    return (
        <LiffContext.Provider value={liffObject}>
            {children}
        </LiffContext.Provider>
    );
}