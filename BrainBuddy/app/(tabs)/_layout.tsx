import { Stack } from "expo-router";
import {STTProvider} from "@/providers/stt";

export default function RootLayout() {
    return (
        <STTProvider>
            <Stack screenOptions={{ headerShown: true }} />
        </STTProvider>
    );
}