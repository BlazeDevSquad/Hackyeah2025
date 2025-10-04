import React, {useState} from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    StyleSheet,
    Modal,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import {
    ExpoSpeechRecognitionModule as STT,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import {useSTT} from "@/providers/stt";
import useGemini from "@/axios/axios";
import {speakText} from "@/utils/tts";

export default function Dictate() {
    const {transcript, setTranscript, listening, setListening} = useSTT();
    const [partial, setPartial] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [aiResponse, setAiResponse] = useState("");

    const {sendToGemini, history} = useGemini(); // 👈 korzystamy z hooka

    useSpeechRecognitionEvent("result", (e) => {
        const finals = e.results
            .filter((r: any) => r.isFinal)
            .map((r: any) => r.transcript)
            .join(" ");
        const interims = e.results
            .filter((r: any) => !r.isFinal)
            .map((r: any) => r.transcript)
            .join(" ");

        if (finals) setTranscript((prev) => (prev ? prev + " " + finals : finals));
        setPartial(interims);
    });

    useSpeechRecognitionEvent("end", async () => {
        setListening(false);
        const text = (transcript + " " + partial).trim();
        setPartial("");

        if (!text) return;

        try {
            setAiResponse("");
            setModalVisible(true);
            const reply = await sendToGemini(text); // 👈 wysyłamy do Gemini
            setAiResponse(reply);
        } catch (err) {
            setAiResponse("❌ Błąd komunikacji z Gemini");
        }
        finally {
            speakText(aiResponse);
        }
    });

    useSpeechRecognitionEvent("error", () => setListening(false));

    const start = async () => {
        const perm = await STT.requestPermissionsAsync();
        if (!perm.granted) return;
        setTranscript("");
        setPartial("");
        setListening(true);
        STT.start({interimResults: true, continuous: false});
    };

    const stop = () => STT.stop();

    return (
        <View style={s.c}>
            <Text style={s.h}>🎙️ Dictating</Text>

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

            {/* Modal z odpowiedzią Gemini */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={s.modalBackdrop}>
                    <View style={s.modalCard}>
                        <Text style={s.modalTitle}>🤖 Odpowiedź Gemini</Text>

                        {aiResponse ? (
                            <ScrollView style={{maxHeight: 300}}>
                                <Text style={s.modalText}>{aiResponse}</Text>
                            </ScrollView>
                        ) : (
                            <View style={{alignItems: "center", padding: 20}}>
                                <ActivityIndicator size="large"/>
                                <Text>Myślę nad odpowiedzią…</Text>
                            </View>
                        )}

                        <Pressable
                            onPress={() => setModalVisible(false)}
                            style={[s.btn, s.primary]}
                        >
                            <Text style={s.bt}>Zamknij</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    c: {flex: 1, gap: 12, padding: 16, backgroundColor: "#fff"},
    h: {fontSize: 20, fontWeight: "700"},
    in: {
        flex: 1,
        minHeight: 220,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        padding: 12,
        textAlignVertical: "top",
    },
    row: {flexDirection: "row", gap: 12},
    btn: {paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12},
    primary: {backgroundColor: "#111827"},
    bt: {color: "#fff", fontWeight: "600"},
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
    modalTitle: {fontSize: 18, fontWeight: "700"},
    modalText: {fontSize: 16, lineHeight: 22},
});