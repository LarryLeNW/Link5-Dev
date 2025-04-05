"use client";

import { ThemeContext } from "@/context/ThemeContext";
import React, { useContext, useEffect, useState, ReactNode } from "react";

interface ThemeProviderProps {
    children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { theme }: any = useContext(ThemeContext);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted) {
        return <div className={theme}>{children}</div>;
    }

};

export default ThemeProvider;
