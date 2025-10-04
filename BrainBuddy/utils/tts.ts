import * as Speech from "expo-speech";

let ttsBusy = false;

export function speakText(text: string) {
    const t = (text ?? "").trim();
    if (!t) {
        console.log("[TTS] skip speak — empty text");
        return;
    }
    if (ttsBusy) {
        console.log("[TTS] busy → stopping previous");
        try { Speech.stop(); } catch {}
    }
    ttsBusy = true;

    try {
        Speech.speak(t, {
            language: "en-US",
            onDone: () => { ttsBusy = false; },
            onStopped: () => { ttsBusy = false; },
            onError: (e) => {
                ttsBusy = false;
                console.warn("[TTS] speak error:", e);
            },
        });
    } catch (e) {
        ttsBusy = false;
        console.warn("[TTS] top-level speak error:", e);
    }
}