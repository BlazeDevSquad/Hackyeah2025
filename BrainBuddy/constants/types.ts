export interface Task {
  name: string;
  date?: string; // Using string for ISO 8601 datetime format, both deadline and date type can use this field, in case of deadline date means end of deadline
  date_type: "deadline" | "date";
  priority: 1 | 2 | 3;
  estimated_time: number; // in minutes
  status: "planned" | "done";
}
