import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/constants/types';

const createDate = (days: number, hours?: number, minutes?: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    if (hours !== undefined) date.setHours(hours);
    if (minutes !== undefined) date.setMinutes(minutes);
    return date.toISOString();
};

const initialTasks: Task[] = [
    { id: '1', name: 'Finalize Q4 report', date: createDate(10, 23, 59), date_type: 'deadline', priority: 1, estimated_time: 180, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 3 },
    { id: '2', name: 'Submit project proposal', date: createDate(5, 17, 0), date_type: 'deadline', priority: 2, estimated_time: 120, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 4 },
    { id: '3', name: 'Buy birthday gift for Alex', date: createDate(3, 23, 59), date_type: 'deadline', priority: 3, estimated_time: 45, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },
    { id: '4', name: 'Research new project management tools with a very long name to test overflow', date: createDate(15, 23, 59), date_type: 'deadline', priority: 3, estimated_time: 90, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },
    { id: '5', name: 'Team Standup Meeting', date: createDate(0, 9, 0), date_type: 'date', priority: 1, estimated_time: 30, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 2 },
    { id: '6', name: 'Doctor\'s Appointment', date: createDate(0, 14, 30), date_type: 'date', priority: 1, estimated_time: 60, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 1 },
    { id: '7', name: 'Follow up with client', date: createDate(1, 11, 0), date_type: 'date', priority: 2, estimated_time: 45, status: 'planned', created_at: new Date(), updated_at: new Date(), required_stamina: 3 },
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
