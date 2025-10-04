import { View, Text, Pressable } from "react-native";
import * as Speech from "expo-speech";
import {useSTT} from "@/providers/stt";

export default function Speak() {
    const { transcript } = useSTT();
    const speak = () => {
        const text = transcript || "Nie mam tekstu do przeczytania.";
        Speech.speak(text, { language: "en-US", rate: 0.95 }); // iOS bez PL TTS
    };
    return (
        <View style={{ flex:1, padding:16, gap:12 }}>
            <Text style={{ fontSize:20, fontWeight:"700" }}>🔊 Mówienie</Text>
            <Text>{transcript || "Brak transkrypcji (idź na /dictate)"}</Text>
            <Pressable onPress={speak} style={{ backgroundColor:"#111827", padding:12, borderRadius:12 }}>
                <Text style={{ color:"#fff", fontWeight:"600" }}>Czytaj na głos</Text>
            </Pressable>
        </View>
    );
}