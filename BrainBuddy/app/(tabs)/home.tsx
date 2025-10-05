import {Pressable, ScrollView, StyleSheet, Text, View, Dimensions} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Link} from "expo-router";
import { useThemedStyles } from "@/hooks/use-themed-styles";
import { useTasks } from "@/providers/tasks";
import { useMemo } from "react";
import { PieChart, BarChart } from "react-native-chart-kit";
import { Task } from "@/constants/types";

const screenWidth = Dimensions.get("window").width;

const processTaskPerformance = (tasks: Task[], colors: any) => {
    let below = 0;
    let exceeded20 = 0;
    let exceeded50 = 0;
    let exceeded100 = 0;

    tasks.forEach(task => {
        if (task.status === 'done' && task.started_at && task.finished_at) {
            const actual = (task.finished_at.getTime() - task.started_at.getTime()) / (1000 * 60);
            const estimated = task.estimated_time;
            if (estimated === 0) return;
            const diff = (actual - estimated) / estimated;

            if (diff <= 0) below++;
            else if (diff <= 0.2) exceeded20++;
            else if (diff <= 0.5) exceeded50++;
            else exceeded100++;
        }
    });

    const legendColor = colors.subtext || "#7F7F7F";
    const legendFontSize = 12;

    return [
        { name: "On Time", population: below, color: "#10b981", legendFontColor: legendColor, legendFontSize },
        { name: "<20% Over", population: exceeded20, color: "#eab308", legendFontColor: legendColor, legendFontSize },
        { name: "<50% Over", population: exceeded50, color: "#f97316", legendFontColor: legendColor, legendFontSize },
        { name: ">50% Over", population: exceeded100, color: "#dc2626", legendFontColor: legendColor, legendFontSize },
    ].filter(d => d.population > 0);
};


export default function HomeScreen() {
    const { colors } = useThemedStyles();
    const { tasks } = useTasks();

    const chartConfig = {
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        color: (opacity = 1) => colors.subtext || `rgba(148, 163, 184, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.8,
        useShadows: false,
        decimalPlaces: 0, 
    };
    
    const pieChartConfig = {
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        color: (opacity = 1) => colors.text || `rgba(226, 232, 240, ${opacity})`,
    };

    const { allTimePerformance, weeklyPerformance, timeOfDayPerformance } = useMemo(() => {
        const doneTasks = tasks.filter(t => t.status === 'done' && t.started_at && t.finished_at);

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const weeklyTasks = doneTasks.filter(t => new Date(t.finished_at!) > lastWeek);

        const timeSlots = {
            '0-4h': { total: 0, exceeded: 0 }, '4-8h': { total: 0, exceeded: 0 },
            '8-12h': { total: 0, exceeded: 0 }, '12-16h': { total: 0, exceeded: 0 },
            '16-20h': { total: 0, exceeded: 0 }, '20-24h': { total: 0, exceeded: 0 },
        };

        doneTasks.forEach(task => {
            const hour = new Date(task.started_at!).getHours();
            const actual = (new Date(task.finished_at!).getTime() - new Date(task.started_at!).getTime()) / (1000 * 60);
            
            let slot: keyof typeof timeSlots | null = null;
            if (hour < 4) slot = '0-4h';
            else if (hour < 8) slot = '4-8h';
            else if (hour < 12) slot = '8-12h';
            else if (hour < 16) slot = '12-16h';
            else if (hour < 20) slot = '16-20h';
            else slot = '20-24h';

            if (slot) {
                timeSlots[slot].total++;
                if (actual > task.estimated_time) {
                    timeSlots[slot].exceeded++;
                }
            }
        });

        const timeData = {
            labels: Object.keys(timeSlots),
            datasets: [{
                data: Object.values(timeSlots).map(s => s.total > 0 ? Math.round((s.exceeded / s.total) * 100) : 0)
            }]
        };

        return {
            allTimePerformance: processTaskPerformance(doneTasks, colors),
            weeklyPerformance: processTaskPerformance(weeklyTasks, colors),
            timeOfDayPerformance: timeData
        };
    }, [tasks, colors]);


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.content,
                ]}
            >
                <Text style={[styles.title, { color: colors.text }]}>Welcome Back! 👋</Text>
                <Text style={[styles.subtitle, { color: colors.subtext, fontSize: 16, marginTop: -12, marginBottom: 12 }]}>Here's a look at your productivity.</Text>
                
                <Text style={[styles.subtitle, { color: colors.text }]}>Last Week's Performance</Text>
                <Text style={[styles.chartDescription, { color: colors.subtext }]}>How well you stuck to your time estimates last week.</Text>
                <View style={[styles.bigCard, { backgroundColor: colors.card }]}>
                    {weeklyPerformance.length > 0 ? (
                        <PieChart
                            data={weeklyPerformance}
                            width={screenWidth - 64}
                            height={screenWidth > 400 ? 180 : 160}
                            chartConfig={pieChartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                        />
                    ) : <Text style={{ color: colors.subtext }}>No data for last week.</Text>}
                </View>

                <Text style={[styles.subtitle, { color: colors.text }]}>All-Time Performance</Text>
                <Text style={[styles.chartDescription, { color: colors.subtext }]}>Your overall performance since you started.</Text>
                <View style={[styles.bigCard, { backgroundColor: colors.card }]}>
                    {allTimePerformance.length > 0 ? (
                        <PieChart
                            data={allTimePerformance}
                            width={screenWidth - 64}
                            height={screenWidth > 400 ? 180 : 160}
                            chartConfig={pieChartConfig}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                        />
                    ) : <Text style={{ color: colors.subtext }}>No completed tasks yet.</Text>}
                </View>

                <Text style={[styles.subtitle, { color: colors.text }]}>Your Most Productive Times</Text>
                <Text style={[styles.chartDescription, { color: colors.subtext }]}>Percentage of tasks that went over their estimated time. Lower is better!</Text>
                <View style={[styles.bigCard, { backgroundColor: colors.card, paddingRight: 24, paddingBottom: 24, paddingHorizontal: 12 }]}>
                   {timeOfDayPerformance.datasets[0].data.some(v => v > 0) ? (
                    <BarChart
                        data={timeOfDayPerformance}
                        width={screenWidth - 60}
                        height={280}
                        chartConfig={chartConfig}
                        yAxisSuffix="%"
                        fromZero
                        showValuesOnTopOfBars
                        verticalLabelRotation={70}
                    />
                    ) : <Text style={{ color: colors.subtext }}>No data for time of day performance.</Text>}
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
        paddingBottom: 40,
    },
    title: { fontSize: 34, fontWeight: "900" },
    subtitle: { fontSize: 18, fontWeight: "800", marginTop: 6, marginBottom: 2 },
    chartDescription: { fontSize: 14, marginBottom: 8 },
    row: { },
    rowActions: { flexDirection: "row", gap: 12 },
    bigCard: {
        borderRadius: 18,
        padding: 16,
        minHeight: 160,
        alignItems: 'center',
        justifyContent: 'center',
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
