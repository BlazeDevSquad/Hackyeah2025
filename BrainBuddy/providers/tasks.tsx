import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import {Task} from '@/constants/types';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function notify(title: string, body: string, data?: Record<string, any>) {
    const content = {title, body, data};

    await Notifications.scheduleNotificationAsync({content, trigger: null});

}

function fmtDate(d?: string | Date) {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleString();
}

const createDate = (days: number, hours?: number, minutes?: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    if (hours !== undefined) date.setHours(hours);
    if (minutes !== undefined) date.setMinutes(minutes);
    return date;
};

const createPastDate = (daysAgo: number, hour: number, minute: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hour, minute, 0, 0);
    return date;
};

const createFinishedTask = (
    id: number,
    name: string,
    daysAgo: number,
    startHour: number,
    startMinute: number,
    estimatedMinutes: number,
    priority: 1 | 2 | 3 | 4 | 5,
    stamina: 1 | 2 | 3 | 4 | 5
): Task => {
    const startDate = createPastDate(daysAgo, startHour, startMinute);
    
    let durationMinutes;
    
    let baseMultiplier = 1.35;
    if (startHour >= 8 && startHour < 12) baseMultiplier = 1.15;
    else if (startHour >= 12 && startHour < 16) baseMultiplier = 0.9;
    else if (startHour >= 16 && startHour < 20) baseMultiplier = 1.25;

    const randomFactor = (Math.random() - 0.45) * 0.7; 
    const ageFactor = daysAgo > 7 ? 0.1 : 0;
    const finalMultiplier = baseMultiplier + randomFactor + ageFactor;
    durationMinutes = Math.max(5, Math.floor(estimatedMinutes * finalMultiplier));

    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return {
        id: `hist-${id}`,
        name,
        date: endDate,
        date_type: 'date',
        created_at: new Date(startDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 2),
        updated_at: endDate,
        started_at: startDate,
        finished_at: endDate,
        priority,
        required_stamina: stamina,
        estimated_time: estimatedMinutes,
        status: 'done',
    };
};

const initialTasks: Task[] = [
    { id: '1', name: 'Finalize Q4 report', date: createDate(10, 23, 59), date_type: 'deadline', priority: 1, estimated_time: 180, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 5 },
    { id: '2', name: 'Submit project proposal', date: createDate(5, 17, 0), date_type: 'deadline', priority: 2, estimated_time: 120, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 4 },
    { id: '3', name: 'Buy birthday gift for Alex', date: createDate(3, 23, 59), date_type: 'deadline', priority: 3, estimated_time: 45, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },
    { id: '4', name: 'Research new project management tools', date: createDate(15, 23, 59), date_type: 'deadline', priority: 4, estimated_time: 90, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },
    { id: '5', name: 'Team Standup Meeting', date: createDate(0, 9, 0), date_type: 'date', priority: 1, estimated_time: 30, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },
    { id: '6', name: 'Doctor\'s Appointment', date: createDate(0, 14, 30), date_type: 'date', priority: 1, estimated_time: 60, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },
    { id: '7', name: 'Follow up with client', date: createDate(1, 11, 0), date_type: 'date', priority: 2, estimated_time: 45, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 3 },
    { id: '8', name: 'Prepare presentation for Monday', date: createDate(2, 16, 0), date_type: 'date', priority: 2, estimated_time: 90, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 4 },
    { id: '9', name: 'Grocery Shopping', date: createDate(0, 18, 0), date_type: 'date', priority: 4, estimated_time: 60, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },
    { id: '10', name: 'Plan weekend trip', date: createDate(4, 23, 59), date_type: 'deadline', priority: 5, estimated_time: 75, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },

    createFinishedTask(1, "Review weekly analytics", 1, 9, 0, 60, 3, 3),
    createFinishedTask(2, "Client check-in call", 2, 11, 0, 30, 2, 2),
    createFinishedTask(3, "Update Jira tickets", 3, 10, 30, 45, 4, 2),
    createFinishedTask(4, "Write blog post draft", 4, 13, 15, 90, 3, 4),
    createFinishedTask(5, "Test new API endpoint", 5, 15, 0, 60, 2, 3),
    createFinishedTask(6, "Weekly team sync", 6, 14, 0, 60, 2, 2),
    createFinishedTask(7, "Go for a run", 7, 18, 0, 45, 5, 3),
    createFinishedTask(8, "Meal prep for the week", 7, 19, 0, 90, 4, 2),

    createFinishedTask(9, "Design new UI mockups", 8, 17, 0, 180, 1, 5),
    createFinishedTask(10, "Code review for junior dev", 9, 16, 30, 60, 2, 3),
    createFinishedTask(11, "Book flights for conference", 10, 10, 0, 45, 4, 1),
    createFinishedTask(12, "Brainstorm campaign ideas", 11, 11, 0, 90, 3, 3),
    createFinishedTask(13, "Create user flow diagrams", 12, 12, 30, 120, 3, 4),
    createFinishedTask(14, "Fix critical bug in production", 13, 13, 0, 180, 1, 5),
    createFinishedTask(15, "Read a chapter of a book", 14, 21, 0, 30, 5, 1),
    createFinishedTask(16, "Water the plants", 15, 20, 0, 10, 5, 1),
    createFinishedTask(17, "Respond to overdue emails", 16, 9, 30, 45, 2, 2),
    createFinishedTask(18, "Create database schema", 17, 8, 0, 120, 2, 4),
    createFinishedTask(19, "Interview new candidate", 18, 14, 0, 60, 3, 2),
    createFinishedTask(20, "Set up new dev environment", 19, 16, 30, 120, 4, 3),
    createFinishedTask(21, "Performance review meeting", 20, 11, 0, 60, 2, 3),
    createFinishedTask(22, "Prototype a new feature", 21, 9, 30, 150, 1, 4),
    createFinishedTask(23, "Update project dependencies", 22, 10, 0, 60, 4, 2),
    createFinishedTask(24, "Write documentation", 23, 17, 0, 90, 3, 3),
    createFinishedTask(25, "Clean the apartment", 24, 15, 0, 120, 5, 2),
];


type TasksContextType = {
    tasks: Task[];
    getAllTasks: () => Task[];
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    modifyTask: (updatedTask: Task) => Promise<void>;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fullTaskList = [...initialTasks];
        for (let i = 0; i < 30; i++) {
             fullTaskList.push(createFinishedTask(
                100 + i, `Old Task ${i}`, 
                8 + Math.floor(i/2),
                8 + (i % 12),
                (i * 15) % 60,
                30 + (i * 5),
                (i % 5) + 1 as any, 
                (i % 5) + 1 as any));
        }
        setTasks(fullTaskList);
    }, []);

    useEffect(() => {
        (async () => {
            if (Platform.OS === 'ios') {
                const {status: existing} = await Notifications.getPermissionsAsync();
                if (existing !== 'granted') {
                    await Notifications.requestPermissionsAsync({
                        ios: {allowAlert: true, allowBadge: true, allowSound: true},
                    });
                }
            }
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'Default',
                    importance: Notifications.AndroidImportance.DEFAULT,
                });
            }
        })();
    }, []);

    const getAllTasks = (): Task[] => tasks;

    const addTask: TasksContextType['addTask'] = async (taskData) => {
        const newTask: Task = {
            id: new Date().toISOString() + Math.random(),
            ...taskData,
            created_at: new Date(),
            updated_at: new Date(),
        };

        setTasks(prev => [...prev, newTask]);

        const title =
            newTask.date_type === 'deadline' ? 'New deadline added' : 'New task added';
        const body = newTask.date ? `${newTask.name} at ${fmtDate(newTask.date)}` : newTask.name;

        try {
            await notify(title, body, {taskId: newTask.id, priority: newTask.priority});
        } catch (e) {
            console.warn('[Notifications] Failed to notify (add):', e);
        }
    };

    const modifyTask: TasksContextType['modifyTask'] = async (updatedTask) => {
        const prev = tasks.find(t => t.id === updatedTask.id);

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === updatedTask.id ? { ...updatedTask, updated_at: new Date() } : task
            )
        );

        const changes: string[] = [];
        if (prev) {
            if (prev.name !== updatedTask.name) changes.push(`name → "${updatedTask.name}"`);
            if (prev.date !== updatedTask.date) changes.push(`time → ${fmtDate(updatedTask.date)}`);
            if (prev.priority !== updatedTask.priority) changes.push(`priority → P${updatedTask.priority ?? '-'}`);
            if (prev.status !== updatedTask.status) changes.push(`status → ${updatedTask.status}`);
            if (prev.estimated_time !== updatedTask.estimated_time) changes.push(`duration → ${updatedTask.estimated_time} min`);
        }

        const title = 'Task updated';
        const body =
            changes.length > 0 ? `${updatedTask.name}: ${changes.join(', ')}` : `${updatedTask.name} updated`;

        try {
            await notify(title, body, {taskId: updatedTask.id, priority: updatedTask.priority});
        } catch (e) {
            console.warn('[Notifications] Failed to notify (update):', e);
        }
    };

    const value: TasksContextType = {tasks, getAllTasks, addTask, modifyTask};

    return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
}