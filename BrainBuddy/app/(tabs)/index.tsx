import { Link } from "expo-router";
import { View, Text } from "react-native";

export default function Home() {
    return (
        <View style={{ flex:1, gap:12, padding:16 }}>
            <Text style={{ fontSize:20, fontWeight:"700" }}>BrainBuddy</Text>
            <Link href="/dictate">🎙️ Dyktowanie (STT)</Link>
            <Link href="/speak">🔊 Mówienie (TTS)</Link>
        </View>
    );
}