import { createContext, useState, useCallback, useContext, ReactNode } from 'react';
import { Task, Column } from '@/types/task';

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    status: 'todo',
    tasks: [
      {
        id: '1',
        summary: 'Design user authentication flow',
        description: 'Create wireframes and mockups for the login and registration process',
        assignee: 'John Doe',
        createdDate: new Date('2024-06-10'),
        startDate: null,
        shipDate: new Date('2024-06-20'),
        status: 'todo'
      },
      {
        id: '2',
        summary: 'Implement user dashboard',
        description: 'Build the main dashboard with user statistics and recent activity',
        assignee: 'Jane Smith',
        createdDate: new Date('2024-06-12'),
        startDate: new Date('2024-06-15'),
        shipDate: new Date('2024-06-25'),
        status: 'todo'
      }
    ]
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    status: 'inprogress',
    tasks: [
      {
        id: '3',
        summary: 'Setup database schema',
        description: 'Create and configure the database tables for user management',
        assignee: 'Bob Johnson',
        createdDate: new Date('2024-06-08'),
        startDate: new Date('2024-06-10'),
        shipDate: new Date('2024-06-18'),
        status: 'inprogress'
      }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    status: 'done',
    tasks: [
      {
        id: '4',
        summary: 'Project setup and configuration',
        description: 'Initialize the project structure and configure development environment',
        assignee: 'Alice Wilson',
        createdDate: new Date('2024-06-05'),
        startDate: new Date('2024-06-05'),
        shipDate: new Date('2024-06-07'),
        status: 'done'
      }
    ]
  }
];

interface TaskContextType {
  columns: Column[];
  createTask: (taskData: Omit<Task, 'id' | 'createdDate'>) => void;
  moveTask: (taskId: string, targetColumnId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdDate'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdDate: new Date()
    };

    setColumns(prev =>
      prev.map(column =>
        column.status === 'todo'
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      )
    );
  }, []);

  const moveTask = useCallback((taskId: string, targetColumnId: string) => {
    setColumns(prev => {
      const newColumns = [...prev];
      let draggedTaskData: Task | null = null;

      newColumns.forEach(column => {
        const taskIndex = column.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          draggedTaskData = { ...column.tasks[taskIndex] };
          column.tasks.splice(taskIndex, 1);
        }
      });

      if (draggedTaskData) {
        const targetColumn = newColumns.find(column => column.id === targetColumnId);
        if (targetColumn) {
          draggedTaskData.status = targetColumn.status;
          targetColumn.tasks.push(draggedTaskData);
        }
      }

      return newColumns;
    });
  }, []);

  return (
    <TaskContext.Provider value={{ columns, createTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
