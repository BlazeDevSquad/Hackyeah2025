import React, {useState} from "react";
import {View, Text, Pressable, TextInput, StyleSheet} from "react-native";
import {
    ExpoSpeechRecognitionModule as STT,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import {useSTT} from "@/providers/stt";

export default function Dictate() {
    const {transcript, setTranscript, listening, setListening} = useSTT();
    const [partial, setPartial] = useState("");

    useSpeechRecognitionEvent("result", (e) => {
        const finals = e.results
            .filter((r: any) => r.isFinal)
            .map((r: any) => r.transcript)
            .join(" ");
        const interims = e.results
            .filter((r: any) => !r.isFinal)
            .map((r: any) => r.transcript)
            .join(" ");

        setTranscript(transcript ? transcript + " " + finals : finals);
        setPartial(interims);
    });
    useSpeechRecognitionEvent("end", () => setListening(false));
    useSpeechRecognitionEvent("error", () => setListening(false));

    const start = async () => {
        const perm = await STT.requestPermissionsAsync();
        if (!perm.granted) return;
        setTranscript("");
        setPartial("");
        setListening(true);
        STT.start({lang: "pl-PL", interimResults: true, continuous: false});
    };
    const stop = () => STT.stop();

    return (
        <View style={s.c}>
            <Text style={s.h}>🎙️ Dyktowanie (pl-PL)</Text>
            <TextInput
                style={s.in}
                multiline
                value={transcript + (partial ? " " + partial : "")}
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
        textAlignVertical: "top"
    },
    row: {flexDirection: "row", gap: 12},
    btn: {paddingVertical: 12, paddingHorizontal: 18, borderRadius: 12},
    primary: {backgroundColor: "#111827"},
    bt: {color: "#fff", fontWeight: "600"}
});