// app/(tabs)/home.tsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome 👋</Text>
            <Text style={styles.subtitle}>Quick actions</Text>

            <View style={styles.row}>
                <Link href="/(tabs)/plan" asChild>
                    <Pressable style={styles.card}><Text style={styles.cardTxt}>Open Planner</Text></Pressable>
                </Link>
                <Link href="/(tabs)/tasks" asChild>
                    <Pressable style={styles.card}><Text style={styles.cardTxt}>View Tasks</Text></Pressable>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0b0b0c", padding: 16, gap: 12 },
    title: { color: "#fff", fontSize: 34, fontWeight: "800", marginTop: 60 },
    subtitle: { color: "#9ca3af", fontSize: 16, fontWeight: "700", marginBottom: 8 },
    row: { flexDirection: "row", gap: 12 },
    card: { flex: 1, backgroundColor: "#111318", padding: 16, borderRadius: 14 },
    cardTxt: { color: "#fff", fontWeight: "800", textAlign: "center" },
});