import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/constants/types';

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
    
    // Peak performance window is now 12 PM to 4 PM (16:00)
    if (startHour >= 12 && startHour < 16) {
        // Inside peak window: actual time is always less than estimated time
        durationMinutes = estimatedMinutes * (Math.random() * 0.3 + 0.6); // 60% to 90% of estimated
    } else {
        // Outside peak window: actual time always exceeds estimated time
        // Make recent failures (last week) less severe than older failures to differentiate charts
        if (daysAgo <= 7) {
            // Last week: Exceed by 10% to 50%
            durationMinutes = estimatedMinutes * (Math.random() * 0.4 + 1.1);
        } else {
            // Older tasks: Exceed by 40% to 100%
            durationMinutes = estimatedMinutes * (Math.random() * 0.6 + 1.4);
        }
    }
    durationMinutes = Math.floor(durationMinutes);


    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return {
        id: `hist-${id}`,
        name,
        date: endDate,
        date_type: 'date',
        created_at: new Date(startDate.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 2), // Created sometime before
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
    // Existing & New Planned Tasks
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

    // LAST WEEK (daysAgo <= 7) -> Performance is slightly worse
    createFinishedTask(1, "Review weekly analytics", 1, 9, 0, 60, 3, 3),      // Bad
    createFinishedTask(2, "Client check-in call", 2, 11, 0, 30, 2, 2),      // Bad
    createFinishedTask(3, "Update Jira tickets", 3, 10, 30, 45, 4, 2),     // Bad
    createFinishedTask(4, "Write blog post draft", 4, 13, 15, 90, 3, 4),   // Good
    createFinishedTask(5, "Test new API endpoint", 5, 15, 0, 60, 2, 3),     // Good
    createFinishedTask(6, "Weekly team sync", 6, 14, 0, 60, 2, 2),         // Good
    createFinishedTask(7, "Go for a run", 7, 18, 0, 45, 5, 3),             // Bad
    createFinishedTask(8, "Meal prep for the week", 7, 19, 0, 90, 4, 2),   // Bad

    // OLDER TASKS (daysAgo > 7) -> Performance is much worse outside noon
    createFinishedTask(9, "Design new UI mockups", 8, 17, 0, 180, 1, 5),   // Bad (old)
    createFinishedTask(10, "Code review for junior dev", 9, 16, 30, 60, 2, 3), // Bad (old)
    createFinishedTask(11, "Book flights for conference", 10, 10, 0, 45, 4, 1),// Bad (old)
    createFinishedTask(12, "Brainstorm campaign ideas", 11, 11, 0, 90, 3, 3),// Bad (old)
    createFinishedTask(13, "Create user flow diagrams", 12, 12, 30, 120, 3, 4),// Good
    createFinishedTask(14, "Fix critical bug in production", 13, 13, 0, 180, 1, 5),// Good
    createFinishedTask(15, "Read a chapter of a book", 14, 21, 0, 30, 5, 1), // Bad (old)
    createFinishedTask(16, "Water the plants", 15, 20, 0, 10, 5, 1),       // Bad (old)
    createFinishedTask(17, "Respond to overdue emails", 16, 9, 30, 45, 2, 2),// Bad (old)
    createFinishedTask(18, "Create database schema", 17, 8, 0, 120, 2, 4),  // Bad (old)
    createFinishedTask(19, "Interview new candidate", 18, 14, 0, 60, 3, 2), // Good
    createFinishedTask(20, "Set up new dev environment", 19, 16, 30, 120, 4, 3),// Bad (old)
    createFinishedTask(21, "Performance review meeting", 20, 11, 0, 60, 2, 3),// Bad (old)
    createFinishedTask(22, "Prototype a new feature", 21, 9, 30, 150, 1, 4), // Bad (old)
    createFinishedTask(23, "Update project dependencies", 22, 10, 0, 60, 4, 2), // Bad (old)
    createFinishedTask(24, "Write documentation", 23, 17, 0, 90, 3, 3),       // Bad (old)
    createFinishedTask(25, "Clean the apartment", 24, 15, 0, 120, 5, 2),       // Good
];


type TasksContextType = {
    tasks: Task[];
    getAllTasks: () => Task[];
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
    modifyTask: (updatedTask: Task) => void;
};

const TasksContext = createContext<TasksContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        // Add more tasks to ensure both pie charts have data
        const fullTaskList = [...initialTasks];
        // To make sure we have enough data for "all time"
        for (let i = 0; i < 30; i++) {
             fullTaskList.push(createFinishedTask(
                100 + i, `Old Task ${i}`, 
                8 + Math.floor(i/2), // days ago (8 to 22)
                8 + (i % 12), // hour (8 to 19)
                (i * 15) % 60, // minute
                30 + (i * 5), // estimated time
                (i % 5) + 1 as any, 
                (i % 5) + 1 as any));
        }
        setTasks(fullTaskList);
    }, []);

    const getAllTasks = (): Task[] => {
        return tasks;
    };

    const addTask = (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
        const newTask: Task = {
            id: new Date().toISOString() + Math.random(), // Simple unique ID for sketch
            ...taskData,
            created_at: new Date(),
            updated_at: new Date(),
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    const modifyTask = (updatedTask: Task) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === updatedTask.id ? { ...updatedTask, updated_at: new Date() } : task
            )
        );
    };

    const value = {
        tasks,
        getAllTasks,
        addTask,
        modifyTask,
    };

    return (
        <TasksContext.Provider value={value}>
            {children}
        </TasksContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TasksContext);
    if (!context) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
}
