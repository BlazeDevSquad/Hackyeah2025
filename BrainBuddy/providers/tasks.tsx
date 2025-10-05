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
    durationMinutes: number,
    estimatedMinutes: number,
    priority: 1 | 2 | 3 | 4 | 5,
    stamina: 1 | 2 | 3 | 4 | 5
): Task => {
    const startDate = createPastDate(daysAgo, startHour, startMinute);
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

    // 55 Finished Tasks for realistic history
    createFinishedTask(1, 'Review weekly analytics', 1, 9, 0, 55, 60, 3, 3),
    createFinishedTask(2, 'Draft initial project scope', 1, 10, 0, 130, 120, 2, 4),
    createFinishedTask(3, 'Client check-in call', 1, 14, 0, 35, 30, 2, 2),
    createFinishedTask(4, 'Update Jira tickets', 1, 15, 0, 40, 45, 4, 2),
    createFinishedTask(5, 'Organize cloud storage files', 2, 11, 30, 90, 75, 5, 2),
    createFinishedTask(6, 'Pay monthly bills', 2, 17, 0, 25, 30, 3, 1),
    createFinishedTask(7, 'Write blog post draft', 3, 9, 15, 110, 90, 3, 4),
    createFinishedTask(8, 'Design new UI mockups', 3, 13, 0, 180, 180, 1, 5),
    createFinishedTask(9, 'Code review for junior dev', 3, 16, 30, 65, 60, 2, 3),
    createFinishedTask(10, 'Book flights for conference', 4, 10, 0, 45, 45, 4, 1),
    createFinishedTask(11, 'Brainstorm marketing campaign ideas', 4, 11, 0, 80, 90, 3, 3),
    createFinishedTask(12, 'Test new API endpoint', 4, 15, 0, 50, 60, 2, 3),
    createFinishedTask(13, 'Weekly team sync', 5, 9, 0, 60, 60, 2, 2),
    createFinishedTask(14, 'Create user flow diagrams', 5, 10, 30, 115, 120, 3, 4),
    createFinishedTask(15, 'Fix critical bug in production', 5, 14, 0, 240, 180, 1, 5),
    createFinishedTask(16, 'Go for a run', 5, 18, 0, 40, 45, 5, 3),
    createFinishedTask(17, 'Meal prep for the week', 6, 16, 0, 90, 90, 4, 2),
    createFinishedTask(18, 'Read a chapter of a book', 6, 21, 0, 35, 30, 5, 1),
    createFinishedTask(19, 'Water the plants', 7, 8, 0, 10, 10, 5, 1),
    createFinishedTask(20, 'Respond to overdue emails', 7, 9, 30, 55, 45, 2, 2),
    createFinishedTask(21, 'Create database schema', 7, 11, 0, 140, 120, 2, 4),
    createFinishedTask(22, 'Interview new candidate', 8, 14, 0, 70, 60, 3, 2),
    createFinishedTask(23, 'Set up new development environment', 8, 15, 30, 100, 120, 4, 3),
    createFinishedTask(24, 'Performance review meeting', 9, 11, 0, 60, 60, 2, 3),
    createFinishedTask(25, 'Prototype a new feature', 9, 13, 30, 150, 150, 1, 4),
    createFinishedTask(26, 'Update dependencies in project', 10, 10, 0, 50, 60, 4, 2),
    createFinishedTask(27, 'Write documentation for component', 10, 14, 0, 85, 90, 3, 3),
    createFinishedTask(28, 'Clean the apartment', 11, 15, 0, 120, 120, 5, 2),
    createFinishedTask(29, 'Call the bank', 12, 12, 0, 20, 15, 3, 1),
    createFinishedTask(30, 'Research vacation destinations', 12, 19, 0, 60, 60, 5, 1),
    createFinishedTask(31, 'Refactor legacy code module', 13, 10, 0, 210, 180, 2, 5),
    createFinishedTask(32, 'Debug mobile layout issue', 13, 14, 30, 75, 60, 1, 3),
    createFinishedTask(33, 'Prepare agenda for project kickoff', 14, 16, 0, 40, 45, 3, 2),
    createFinishedTask(34, 'Gym session', 14, 18, 0, 70, 75, 4, 4),
    createFinishedTask(35, 'Plan weekly goals', 15, 9, 0, 30, 30, 3, 2),
    createFinishedTask(36, 'Optimize database queries', 15, 13, 0, 130, 120, 2, 4),
    createFinishedTask(37, 'Send out customer survey', 16, 11, 30, 55, 60, 3, 2),
    createFinishedTask(38, 'Analyze survey results', 17, 10, 0, 100, 90, 2, 3),
    createFinishedTask(39, 'Create financial forecast', 18, 14, 0, 160, 180, 1, 4),
    createFinishedTask(40, 'Organize team building event', 19, 15, 0, 70, 60, 4, 1),
    createFinishedTask(41, 'Set up CI/CD pipeline', 20, 10, 30, 170, 150, 2, 4),
    createFinishedTask(42, 'Take car for maintenance', 21, 9, 0, 90, 90, 3, 1),
    createFinishedTask(43, 'Learn a new song on guitar', 21, 20, 0, 50, 45, 5, 2),
    createFinishedTask(44, 'Backup personal files', 22, 17, 0, 25, 30, 4, 1),
    createFinishedTask(45, 'Deploy staging server updates', 23, 16, 30, 65, 60, 1, 3),
    createFinishedTask(46, 'Write unit tests for new service', 24, 11, 0, 110, 120, 3, 4),
    createFinishedTask(47, 'Finalize marketing copy', 25, 14, 0, 50, 45, 2, 2),
    createFinishedTask(48, 'Record demo video', 26, 13, 0, 80, 90, 3, 3),
    createFinishedTask(49, 'Update presentation slides', 27, 10, 0, 70, 60, 2, 2),
    createFinishedTask(50, 'Tax preparation', 28, 11, 0, 180, 180, 1, 3),
    createFinishedTask(51, 'Renew domain name', 29, 15, 0, 15, 10, 2, 1),
    createFinishedTask(52, 'Clear out old photos', 30, 19, 0, 55, 60, 5, 1),
    createFinishedTask(53, 'Test cross-browser compatibility', 31, 14, 30, 90, 90, 3, 3),
    createFinishedTask(54, 'Do laundry', 32, 18, 0, 60, 60, 5, 1),
    createFinishedTask(55, 'Review Q3 performance data', 33, 10, 0, 140, 120, 1, 4),
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
        setTasks(initialTasks);
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
