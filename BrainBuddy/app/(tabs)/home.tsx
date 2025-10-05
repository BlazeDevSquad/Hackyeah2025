import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                ]}
            >
                <Text style={styles.title}>Welcome 👋</Text>
                <Text style={styles.subtitle}>Summary</Text>

                <View style={styles.row}>
                    <View style={styles.bigCard}><View style={styles.chart} /></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.bigCard}><View style={styles.chart} /></View>
                </View>
                <View style={styles.row}>
                    <View style={styles.bigCard}><View style={styles.chart} /></View>
                </View>

                <Text style={styles.subtitle}>Quick actions</Text>
                <View style={styles.rowActions}>
                    <Link href="/(tabs)/plan" asChild>
                        <Pressable style={styles.card}><Text style={styles.cardTxt}>Open Planner</Text></Pressable>
                    </Link>
                    <Link href="/(tabs)/tasks" asChild>
                        <Pressable style={styles.card}><Text style={styles.cardTxt}>View Tasks</Text></Pressable>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0b0b0c" },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 16,
    },
    title: { color: "#fff", fontSize: 34, fontWeight: "900" },
    subtitle: { color: "#9ca3af", fontSize: 18, fontWeight: "800", marginTop: 6, marginBottom: 8 },
    row: { },
    rowActions: { flexDirection: "row", gap: 12 },
    bigCard: {
        backgroundColor: "#111318",
        borderRadius: 18,
        padding: 16,
        minHeight: 160,
    },
    chart: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: "#0f1116",
    },
    card: {
        flex: 1,
        backgroundColor: "#111318",
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTxt: { color: "#fff", fontWeight: "800" },
});