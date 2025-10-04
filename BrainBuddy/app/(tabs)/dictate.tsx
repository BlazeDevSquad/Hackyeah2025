import React, { useRef, useState, useEffect } from "react";
import {
    View, Text, Pressable, TextInput, StyleSheet, Modal, ScrollView, ActivityIndicator,
} from "react-native";
import {
    ExpoSpeechRecognitionModule as STT,
    useSpeechRecognitionEvent,
    type ExpoSpeechRecognitionResult,
} from "expo-speech-recognition";
import { useSTT } from "@/providers/stt";
import {callGemini} from "@/axios/axios";
// ⬇️ importujesz swoją funkcję (dostosuj ścieżkę)

type MyResult = ExpoSpeechRecognitionResult & { isFinal?: boolean };

export default function Dictate() {
    const { transcript, setTranscript, listening, setListening } = useSTT();
    const [partial, setPartial] = useState("");
    const [aiResponse, setAiResponse] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);
    const [loadingAI, setLoadingAI] = useState(false);
    const callingRef = useRef(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        return () => { mountedRef.current = false; };
    }, []);

    // Live wyniki
    useSpeechRecognitionEvent("result", (e) => {
        const results = e.results as MyResult[];

        const finals = results.filter(r => r.isFinal).map(r => r.transcript).join(" ");
        const interims = results.filter(r => !r.isFinal).map(r => r.transcript).join(" ");

        if (finals) {
            setTranscript((prev: string) => (prev ? prev + " " : "") + finals);
        }
        setPartial(interims);
    });

    // Koniec nasłuchu → wyślij do Gemini i pokaż modal, jeśli jest odpowiedź
    useSpeechRecognitionEvent("end", async () => {
        setListening(false);

        const fullText = (transcript + (partial ? " " + partial : "")).trim();
        setPartial("");

        if (!fullText || callingRef.current) return;
        callingRef.current = true;
        setLoadingAI(true);

        try {
            const reply = await callGemini(fullText);      // ⬅️ użycie Twojej funkcji
            const clean = (reply || "").trim();
            if (mountedRef.current && clean.length > 0) {
                setAiResponse(clean);
                setModalVisible(true);
            }
        } catch (e) {
            // tu ewentualnie możesz otworzyć inny modal z błędem
            console.log("Gemini error:", e);
        } finally {
            callingRef.current = false;
            if (mountedRef.current) setLoadingAI(false);
        }
    });

    useSpeechRecognitionEvent("error", () => setListening(false));

    const start = async () => {
        const perm = await STT.requestPermissionsAsync();
        if (!perm.granted) return;

        setTranscript("");
        setPartial("");
        setAiResponse("");
        setModalVisible(false);
        setListening(true);

        STT.start({ lang: "pl-PL", interimResults: true, continuous: false });
    };

    const stop = () => STT.stop();

    return (
        <View style={s.c}>
            <Text style={s.h}>🎙️ Dyktowanie (pl-PL)</Text>

            <TextInput
                style={s.in}
                multiline
                value={(transcript + (partial ? " " + partial : "")).trim()}
                placeholder="Mów, a tu będzie się pisać…"
            />

            <View style={s.row}>
                {!listening ? (
                    <Pressable onPress={start} style={[s.btn, s.primary]}>
                        <Text style={s.bt}>Start</Text>
                    </Pressable>
                ) : (
                    <Pressable onPress={stop} style={[s.btn, s.primary]}>
                        <Text style={s.bt}>Stop</Text>
                    </Pressable>
                )}
            </View>

            {/* lekki loader w rogu podczas calla */}
            {loadingAI && (
                <View style={s.loader}>
                    <ActivityIndicator />
                    <Text style={{ marginLeft: 8 }}>Pytam Gemini…</Text>
                </View>
            )}

            {/* Modal z odpowiedzią AI */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={s.modalBackdrop}>
                    <View style={s.modalCard}>
                        <Text style={s.modalTitle}>🤖 Odpowiedź Gemini</Text>
                        <ScrollView style={s.modalBody} contentContainerStyle={{ paddingBottom: 8 }}>
                            <Text selectable style={s.modalText}>{aiResponse}</Text>
                        </ScrollView>
                        <Pressable onPress={() => setModalVisible(false)} style={[s.btn, s.primary]}>
                            <Text style={s.bt}>Zamknij</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    c: { flex: 1, gap: 12, padding: 16, backgroundColor: "#fff" },
    h: { fontSize: 20, fontWeight: "700" },
    in: {
        flex: 1,
        minHeight: 220,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        textAlignVertical: "top",
    },
    row: { flexDirection: "row", gap: 12 },
    btn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12 },
    primary: { backgroundColor: "#111827" },
    bt: { color: "#fff", fontWeight: "600" },
    loader: {
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        padding: 16,
    },
    modalCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        gap: 12,
        maxHeight: "80%",
    },
    modalTitle: { fontSize: 18, fontWeight: "700" },
    modalBody: { maxHeight: 300 },
    modalText: { fontSize: 16, lineHeight: 22 },
});