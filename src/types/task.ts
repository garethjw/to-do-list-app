
export interface Task {
  id: string;
  summary: string;
  description: string;
  assignee: string;
  createdDate: Date;
  startDate: Date | null;
  shipDate: Date | null;
  status: 'todo' | 'inprogress' | 'done';
}

export interface Column {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
  tasks: Task[];
}
