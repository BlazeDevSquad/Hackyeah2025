import React, {useCallback, useMemo, useState} from "react";
import {Dimensions, StyleSheet, Text, View,} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {Calendar, type ICalendarEventBase} from "react-native-big-calendar";
import {addMinutes} from "date-fns";
import {useFocusEffect} from "@react-navigation/native";

const priorityColors: Record<number, string> = {
    1: "#dc2626",
    2: "#f97316",
    3: "#eab308",
    4: "#3b82f6",
    5: "#10b981",
};

type CalEvent = ICalendarEventBase & {
    id: string;
    title: string;
    start: Date;
    end: Date;
    priority?: 1 | 2 | 3 | 4 | 5;
};

export default function PlanScreen() {
    const insets = useSafeAreaInsets();
    const [events, setEvents] = useState<CalEvent[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [draftStart, setDraftStart] = useState<Date | null>(null);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("60");

    const [calKey, setCalKey] = useState(0);

    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const [scrollMinutes, setScrollMinutes] = useState(9 * 60);

    const screen = Dimensions.get("window");
    const tabBarGuess = 90;
    const calendarHeight = screen.height - insets.top - insets.bottom - tabBarGuess;

    const getNowOffsetMinutes = () => {
        const now = new Date();

        return now.getHours() * 60;
    };

    const formatFullDate = (d: Date, locale = "eng-US") =>
        new Intl.DateTimeFormat(locale, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(d);

    useFocusEffect(
        useCallback(() => {
            setCurrentDate(new Date());
            setScrollMinutes(getNowOffsetMinutes());
            setCalKey((k) => k + 1);
        }, [])
    );
    const theme = useMemo(
        () => ({
            palette: {
                primary: "#60a5fa",
                secondary: "#94a3b8",
                nowIndicator: "#22d3ee",
                moreLabel: "#9CA3AF",
                background: "#0b0b0c",
            },
            cellBorderColor: "rgba(255,255,255,0.08)",
            hourGuideColor: "rgba(255,255,255,0.08)",
            hourGuideTextColor: "rgba(255,255,255,0.5)",
            headerBackgroundColor: "#0b0b0c",
            headerTextColor: "#e5e7eb",
            todayName: {color: "#fff", fontWeight: "600"},
        }),
        []
    );

    const handlePressCell = (datePressed: Date) => {
        const d = new Date(datePressed);
        const m = d.getMinutes();
        const rounded = m < 15 ? 0 : m < 45 ? 30 : 0;
        if (rounded === 0 && m >= 45) d.setHours(d.getHours() + 1);
        d.setMinutes(rounded, 0, 0);

        setDraftStart(d);
        setTitle("");
        setDuration("60");
        setModalVisible(true);
    };

    const handleSave = () => {
        if (!draftStart || !title.trim()) {
            setModalVisible(false);
            return;
        }
        const dur = Math.max(5, parseInt(duration || "60", 10));
        const start = draftStart;
        const end = addMinutes(start, dur);

        const id = `${start.toISOString()}__${title.trim()}`;
        setEvents((prev) => [
            ...prev,
            {id, title: title.trim(), start, end, priority: 2},
        ]);
        setModalVisible(false);
    };


    const renderEvent = (e: CalEvent) => {
        const bg = priorityColors[e.priority ?? 3];
        return (
            <View style={[styles.eventCard, {backgroundColor: bg}]}>
                <Text numberOfLines={2} style={styles.eventTitle}>
                    {e.title}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.safe, {paddingBottom: insets.bottom}]}>
            <View style={styles.headerWrap}>
                <Text style={styles.headerTitle}>Plan for this Day</Text>
                <Text style={styles.headerDate}>{formatFullDate(currentDate)}</Text>
            </View>

            <Calendar<CalEvent>
                key={calKey}
                events={events}
                date={currentDate}
                mode="day"
                height={calendarHeight}
                hourRowHeight={54}
                showAllDayEventCell={false}
                renderHeader={() => null}
                calendarCellStyle={{ borderWidth: 0, borderLeftColor: "transparent" }}
                weekStartsOn={1}
                // bodyContainerStyle={{ borderWidth: 0, borderColor: 'transparent' }}
                onPressCell={handlePressCell}
                calendarContainerStyle={{
                    width: "100%",
                }}
                onPressEvent={(e) => setEvents((prev) => prev.filter((x) => x.id !== e.id))}
                renderEvent={renderEvent}
                scrollOffsetMinutes={scrollMinutes}
                hideNowIndicator={false}
                bodyContainerStyle={{
                    borderWidth: 0,
                    borderColor: 'transparent',
                    backgroundColor: "#0b0b0c",
                    marginLeft: -4,      // przesuwa trochę siatkę w lewo
                    marginRight: -8,     // usuwa wolną przestrzeń po prawej
                    // paddingRight: 0,
                    paddingRight: 22 // ⬅️ margines po lewej i prawej

                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: "#0b0b0c", overflowX: "auto"},
    jumpRow: {flexDirection: "row", gap: 8},
    jumpBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    jumpTxt: {color: "#e5e7eb", fontWeight: "600", fontSize: 12},
    eventCard: {
        flex: 1,
        borderRadius: 12,
        padding: 8,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: {width: 0, height: 3},
        elevation: 3,
        justifyContent: "flex-start",
    },
    eventTitle: {color: "white", fontWeight: "700", fontSize: 12, lineHeight: 16},
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "#111318",
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8},
    modalLabel: {color: "#9ca3af", fontSize: 12, fontWeight: "700", marginTop: 8},
    input: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        borderRadius: 10,
        color: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "rgba(255,255,255,0.04)",
    },
    modalActions: {
        marginTop: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    btn: {flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: "center"},
    btnGhost: {backgroundColor: "rgba(255,255,255,0.06)"},
    btnGhostTxt: {color: "#e5e7eb", fontWeight: "700"},
    btnPrimary: {backgroundColor: "#3b82f6"},
    btnPrimaryTxt: {color: "#fff", fontWeight: "800"},
    headerWrap: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 4,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 38,
        fontWeight: "800",
    },
    headerDate: {
        color: "#e5e7eb",
        fontSize: 16,
        fontWeight: "700",
        textTransform: "capitalize",
        marginTop: 6,
        marginBottom: 56,
    },
});