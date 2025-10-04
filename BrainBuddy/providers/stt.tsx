import React, { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type STTState = {
    transcript: string;
    setTranscript: Dispatch<SetStateAction<string>>;
    listening: boolean;
    setListening: Dispatch<SetStateAction<boolean>>;
};

const STTContext = createContext<STTState | null>(null);

export function STTProvider({ children }: { children: React.ReactNode }) {
    const [transcript, setTranscript] = useState("");
    const [listening, setListening] = useState(false);
    return (
        <STTContext.Provider value={{ transcript, setTranscript, listening, setListening }}>
            {children}
        </STTContext.Provider>
    );
}

export function useSTT() {
    const ctx = useContext(STTContext);
    if (!ctx) throw new Error("STTContext is not available – wrap with STTProvider in root layout");
    return ctx;
}