import React, {useCallback, useMemo, useState} from "react";
import {Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {Calendar, EventRenderer, type ICalendarEventBase} from "react-native-big-calendar";
import {addMinutes} from "date-fns";
import {useFocusEffect} from "@react-navigation/native";
import {priorityMap} from "@/app/(tabs)/tasks";
import {useTasks} from "@/providers/tasks";
import {Task} from "@/constants/types";


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

const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const toLocalWallTime = (input: string | Date): Date => {
    if (input instanceof Date) return input;
    const s = String(input);

    const m = s
        .replace(/Z$/i, "")
        .replace(/[+-]\d{2}:\d{2}$/, "")
        .match(/^(\d{4})-(\d{2})-(\d{2})[T ]?(\d{2}):(\d{2})(?::(\d{2}))?$/);

    if (m) {
        const [, Y, M, D, h, min, sec] = m;
        return new Date(
            Number(Y),
            Number(M) - 1,
            Number(D),
            Number(h),
            Number(min),
            Number(sec ?? "0")
        );
    }
    return new Date(s);
};
const two = (n: number) => String(n).padStart(2, "0");
const formatTime = (d: Date) => `${two(d.getHours())}:${two(d.getMinutes())}`;
const formatTimeRange = (s: Date, e: Date) => `${formatTime(s)} – ${formatTime(e)}`;
const priorityLabel = (p?: 1 | 2 | 3 | 4 | 5) => (priorityMap as any)?.[p!]?.label ?? `P${p ?? 3}`;


function tasksToEventsAll(tasks: Task[]): CalEvent[] {

    return tasks
        .filter((t) => !!t.date)
        .map((t) => {
            const start = toLocalWallTime(t.date!);

            const color =
                (priorityMap as any)?.[t.priority]?.color ??
                priorityColors[(t.priority as 1 | 2 | 3 | 4 | 5) ?? 3] ?? "#3b82f6";

            if (t.date_type === "deadline") {
                const end = new Date(start.getTime() + 15 * 60 * 1000);
                return {
                    id: `deadline__${start.toISOString()}__${t.name}`,
                    title: `Due: ${t.name}`,
                    start,
                    end,
                    priority: t.priority as any,
                } as CalEvent;
            } else {
                const dur = Math.max(5, t.estimated_time || 30);
                const end = new Date(start.getTime() + dur * 60 * 1000);
                return {
                    id: `task__${start.toISOString()}__${t.name}`,
                    title: t.name,
                    start,
                    end,
                    priority: t.priority as any,
                } as CalEvent;
            }
        });
}
export default function PlanScreen() {
    const insets = useSafeAreaInsets();
    const [modalVisible, setModalVisible] = useState(false);
    const [draftStart, setDraftStart] = useState<Date | null>(null);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("60");
    const {tasks, addTask, modifyTask} = useTasks();


    const [calKey, setCalKey] = useState(0);

    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const [scrollMinutes, setScrollMinutes] = useState(9 * 60);

    const [userEvents, setUserEvents] = useState<CalEvent[]>([]); // 🔹 osobno userowe

    const [detailsVisible, setDetailsVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);

    const dayTaskEvents = useMemo(() => {
        const evs = tasksToEventsAll(tasks);
        evs.forEach(e => {
            console.log(
                "[CAL_EV]",
                e.title,
                e.start.toString(),
            );
        });
        return evs;
    }, []);
    const events = useMemo(() => {
        const ue = userEvents.filter((e) => isSameDay(e.start, currentDate));
        return [...dayTaskEvents, ...ue];
    }, [dayTaskEvents, userEvents, currentDate]);


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

        setUserEvents((prev) => [
            ...prev,
            {id, title: title.trim(), start, end, priority: 2},
        ]);

        setModalVisible(false);
    };

    const renderEvent: EventRenderer<CalEvent> = (event, touchableOpacityProps) => {
        const bg = (priorityMap as any)?.[event.priority!]?.color ?? "#3b82f6";

        // ⬇️ wyciągamy key i style, resztę propsów rozlewamy
        const {key: itemKey, style, ...rest} = (touchableOpacityProps ?? {}) as {
            key?: string | number;
            style?: any;
            [k: string]: any;
        };

        return (
            <TouchableOpacity
                key={itemKey}
                activeOpacity={0.8}
                {...rest}
                style={[
                    style,
                    {backgroundColor: bg, borderRadius: 12, paddingHorizontal: 12, justifyContent: "center"},
                ]}
            >
                <Text numberOfLines={2} style={{color: "#fff", fontWeight: "700"}}>
                    {event.title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.safe, {paddingBottom: insets.bottom}]}>
            <View style={styles.headerWrap}>
                <Text style={styles.headerTitle}>Plan for this Day</Text>
                <Text style={styles.headerDate}>{formatFullDate(currentDate, "en-US")}</Text>
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
                onPressCell={handlePressCell}

                onPressEvent={(e) => {
                    setSelectedEvent(e);
                    setDetailsVisible(true);
                }}

                eventCellStyle={(e) => ({
                    backgroundColor:
                        (priorityMap as any)?.[e.priority!]?.color ?? '#3b82f6',
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                })}
                renderEvent={renderEvent}
                scrollOffsetMinutes={scrollMinutes}
                hideNowIndicator={false}
                bodyContainerStyle={{
                    borderWidth: 0,
                    borderColor: "transparent",
                    backgroundColor: "#0b0b0c",
                    marginLeft: -4,
                    marginRight: -8,
                    paddingRight: 22,
                }}
                onSwipeEnd={(d) => setCurrentDate(d)}
            />

            <Modal
                visible={detailsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setDetailsVisible(false)}
            >
                <View style={styles.detailsBackdrop}>
                    <View style={styles.detailsCard}>
                        <View style={styles.detailsHeader}>
                            <Text style={styles.detailsTitle} numberOfLines={2}>
                                {selectedEvent?.title ?? ""}
                            </Text>
                            <Text
                                style={styles.detailsClose}
                                onPress={() => setDetailsVisible(false)}
                            >
                                ×
                            </Text>
                        </View>

                        {!!selectedEvent && (
                            <>
                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailsLabel}>Time</Text>
                                    <Text style={styles.detailsValue}>
                                        {formatTimeRange(selectedEvent.start, selectedEvent.end)}
                                    </Text>
                                </View>

                                <View style={styles.rowBetween}>
                                    <Text style={styles.detailsLabel}>Priority</Text>
                                    <View style={styles.prioPill}>
                                        <View
                                            style={[
                                                styles.prioDot,
                                                {
                                                    backgroundColor:
                                                        (priorityMap as any)?.[selectedEvent.priority!]?.color ??
                                                        priorityColors[selectedEvent.priority ?? 3],
                                                },
                                            ]}
                                        />
                                        <Text style={styles.prioText}>{priorityLabel(selectedEvent.priority)}</Text>
                                    </View>
                                </View>

                                {userEvents.some((u) => u.id === selectedEvent.id) && (
                                    <View style={styles.detailsActions}>
                                        <Text
                                            style={styles.deleteBtn}
                                            onPress={() => {
                                                setUserEvents((prev) => prev.filter((x) => x.id !== selectedEvent.id));
                                                setDetailsVisible(false);
                                            }}
                                        >
                                            Delete block
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
    detailsBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",

    },
    detailsCard: {
        backgroundColor: "#111318",
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: 165

    },
    detailsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,


    },
    detailsTitle: {color: "#fff", fontSize: 18, fontWeight: "800", flex: 1, paddingRight: 8},
    detailsClose: {color: "#9ca3af", fontSize: 28, fontWeight: "900", paddingHorizontal: 8, paddingBottom: 2},
    detailsLabel: {color: "#9ca3af", fontSize: 12, fontWeight: "700"},
    detailsValue: {color: "#fff", fontSize: 14, fontWeight: "700"},
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10,
    },
    prioPill: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
        gap: 8,
    },
    prioDot: {width: 10, height: 10, borderRadius: 999},
    prioText: {color: "#e5e7eb", fontWeight: "700", fontSize: 12},
    detailsActions: {marginTop: 16, alignItems: "flex-end", justifyContent: "space-between", height: 100},
    deleteBtn: {
        color: "#ef4444",
        fontWeight: "800",
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: "rgba(239,68,68,0.15)",
        borderRadius: 10,
    },
});