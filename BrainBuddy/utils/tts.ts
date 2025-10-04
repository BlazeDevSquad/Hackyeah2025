import * as Speech from "expo-speech";

export function speakText(text: string) {
    if (!text) return;
    Speech.speak(text, {
        pitch: 1.0,
        rate: 1.0,
    });
}