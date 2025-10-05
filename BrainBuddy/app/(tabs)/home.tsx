import {Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import { useThemedStyles } from "@/hooks/use-themed-styles";

export default function HomeScreen() {
    const { colors } = useThemedStyles();
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                ]}
            >
                <Text style={[styles.title, { color: colors.text }]}>Welcome 👋</Text>
                <Text style={[styles.subtitle, { color: colors.subtext }]}>Summary</Text>

                <View style={styles.row}>
                    <View style={[styles.bigCard, { backgroundColor: colors.card }]}><View style={[styles.chart, { backgroundColor: colors.background }]} /></View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.bigCard, { backgroundColor: colors.card }]}><View style={[styles.chart, { backgroundColor: colors.background }]} /></View>
                </View>
                <View style={styles.row}>
                    <View style={[styles.bigCard, { backgroundColor: colors.card }]}><View style={[styles.chart, { backgroundColor: colors.background }]} /></View>
                </View>

                <Text style={[styles.subtitle, { color: colors.subtext }]}>Quick actions</Text>
                <View style={styles.rowActions}>
                    <Link href="/(tabs)/plan" asChild>
                        <Pressable style={[styles.card, { backgroundColor: colors.card }]}><Text style={[styles.cardTxt, { color: colors.text }]}>Open Planner</Text></Pressable>
                    </Link>
                    <Link href="/(tabs)/tasks" asChild>
                        <Pressable style={[styles.card, { backgroundColor: colors.card }]}><Text style={[styles.cardTxt, { color: colors.text }]}>View Tasks</Text></Pressable>
                    </Link>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 16,
    },
    title: { fontSize: 34, fontWeight: "900" },
    subtitle: { fontSize: 18, fontWeight: "800", marginTop: 6, marginBottom: 8 },
    row: { },
    rowActions: { flexDirection: "row", gap: 12 },
    bigCard: {
        borderRadius: 18,
        padding: 16,
        minHeight: 160,
    },
    chart: {
        flex: 1,
        borderRadius: 12,
    },
    card: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTxt: { fontWeight: "800" },
});
