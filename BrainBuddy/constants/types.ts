export interface Task {
  id?: string;
  name: string;
  date?: string; // Using string for ISO 8601 datetime format, both deadline and date type can use this field, in case of deadline date means end of deadline
  date_type: "deadline" | "date";
  created_at: Date;
  updated_at: Date;
  priority: 1 | 2 | 3 | 4 | 5;
  required_stamina: 1 | 2 | 3 | 4 | 5;
  estimated_time: number; // in minutes
  status: "planned" | "done" | "in progress";
}

export interface GeminiTask {
  operation: "add" | "modify" | "select";
  name: string;
  date?: string; // Using string for ISO 8601 datetime format, both deadline and date type can use this field, in case of deadline date means end of deadline
  date_type: "deadline" | "date";
  priority: 1 | 2 | 3 | 4 | 5;
  required_stamina: 1 | 2 | 3 | 4 | 5;
  estimated_time: number; // in minutes
  status: "planned" | "done" | "in progress";
}

export interface OperationPick {
  operation: "select" | "update";
}
