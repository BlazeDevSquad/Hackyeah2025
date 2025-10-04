import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useThemedStyles } from '@/hooks/use-themed-styles';
import { Task } from '@/constants/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const createDate = (days: number, hours?: number, minutes?: number) => {
 const date = new Date();
 date.setDate(date.getDate() + days);
 if (hours !== undefined) date.setHours(hours);
 if (minutes !== undefined) date.setMinutes(minutes);
  return date.toISOString();
};

const mockTasks: Task[] = [
  // Deadline Tasks
  { name: 'Finalize Q4 report', date: createDate(10, 23, 59), date_type: 'deadline', priority: 1, estimated_time: 180, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 3 },
  { name: 'Submit project proposal', date: createDate(5, 17, 0), date_type: 'deadline', priority: 2, estimated_time: 120, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 4 },
  { name: 'Buy birthday gift for Alex', date: createDate(3, 23, 59), date_type: 'deadline', priority: 3, estimated_time: 45, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },
  { name: 'Research new project management tools with a very long name to test overflow', date: createDate(15, 23, 59), date_type: 'deadline', priority: 3, estimated_time: 90, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },

  // Dated Tasks for Today
  { name: 'Team Standup Meeting', date: createDate(0, 9, 0), date_type: 'date', priority: 1, estimated_time: 30, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },
  { name: 'Doctor\'s Appointment', date: createDate(0, 14, 30), date_type: 'date', priority: 1, estimated_time: 60, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },

  // Dated Task for Tomorrow
  { name: 'Follow up with client', date: createDate(1, 11, 0), date_type: 'date', priority: 2, estimated_time: 45, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 3 },
];


const priorityMap = {
  1: { label: 'Insane', color: '#ef4444' },
  2: { label: 'High', color: '#f97316' },
  3: { label: 'Medium', color: '#daf63bff' },
  4: { label: 'Easy', color: '#4225c5ff' },
  5: { label: 'No effort', color: '#48ff00ff' },
};

export default function TasksScreen() {
  const { colors } = useThemedStyles();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const { deadlineTasks, datedTasks } = useMemo(() => {
    const deadline = tasks.filter((t) => t.date_type === 'deadline');
    const dated = tasks
      .filter((t) => t.date_type === 'date' && t.date)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());
    return { deadlineTasks: deadline, datedTasks: dated };
  }, [tasks]);

  const groupedDatedTasks = useMemo(() => {
    return datedTasks.reduce((acc, task) => {
      const day = new Date(task.date!).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [datedTasks]);

  const handleTaskPress = (taskId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedTask(selectedTask === taskId ? null : taskId);
  };

  const renderTaskItem = (task: Task) => {
    const isSelected = selectedTask === task.name;
    const priority = priorityMap[task.priority];

    return (
      <TouchableOpacity
        key={task.name}
        style={[styles.taskCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => handleTaskPress(task.name)}
        activeOpacity={0.7}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.taskName, { color: colors.text }]}>{task.name}</Text>
          <MaterialCommunityIcons
            name={isSelected ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.subtext}
          />
        </View>
        {isSelected && (
          <View style={styles.taskDetailsContainer}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="flag-variant-outline" size={18} color={priority.color} />
              <Text style={[styles.detailText, { color: priority.color }]}>
                {priority.label} Priority
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-time-three-outline" size={18} color={colors.subtext} />
              <Text style={[styles.detailText, { color: colors.subtext }]}>
                {task.estimated_time} minutes
              </Text>
            </View>
            {task.date && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name={task.date_type === 'deadline' ? 'calendar-alert' : 'calendar-clock'}
                  size={18}
                  color={colors.subtext}
                />
                <Text style={[styles.detailText, { color: colors.subtext }]}>
                  {task.date_type === 'deadline'
                    ? `Due: ${new Date(task.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
                    : new Date(task.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Tasks</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Deadline Tasks</Text>
        {deadlineTasks.length > 0 ? (
          deadlineTasks.map(renderTaskItem)
        ) : (
          <Text style={{color: colors.subtext}}>No deadline tasks.</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Scheduled Tasks</Text>
        {Object.keys(groupedDatedTasks).length > 0 ? (
          Object.entries(groupedDatedTasks).map(([day, dayTasks]) => (
            <View key={day} style={styles.dayGroup}>
              <Text style={[styles.dayHeader, { color: colors.subtext, borderBottomColor: colors.border }]}>
                {day}
              </Text>
              {dayTasks.map(renderTaskItem)}
            </View>
          ))
        ) : (
          <Text style={{color: colors.subtext}}>No scheduled tasks.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  dayGroup: {
    marginBottom: 12,
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
  },
  taskCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  taskDetailsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
