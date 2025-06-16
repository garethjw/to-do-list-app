
import { useState, useCallback } from 'react';
import { Task, Column } from '@/types/task';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export const Board = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleCreateTask = useCallback((taskData: Omit<Task, 'id' | 'createdDate'>) => {
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (!taskId || !draggedTask) return;

    setColumns(prev => {
      const newColumns = [...prev];
      let draggedTaskData: Task | null = null;

      // Remove task from source column
      newColumns.forEach(column => {
        const taskIndex = column.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          draggedTaskData = { ...column.tasks[taskIndex] };
          column.tasks.splice(taskIndex, 1);
        }
      });

      // Add task to target column
      if (draggedTaskData) {
        const targetColumn = newColumns.find(column => column.id === targetColumnId);
        if (targetColumn) {
          draggedTaskData.status = targetColumn.status;
          targetColumn.tasks.push(draggedTaskData);
        }
      }

      return newColumns;
    });

    setDraggedTask(null);
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Board</h1>
            <p className="text-gray-600">Manage your tasks and track progress</p>
          </div>
          <CreateTaskModal onCreateTask={handleCreateTask} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div
              key={column.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">{column.title}</h2>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
              </div>
              
              <div className="p-4 min-h-[200px]">
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    onDragStart={() => handleDragStart(task.id)}
                  >
                    <TaskCard 
                      task={task} 
                      isDragging={draggedTask === task.id}
                    />
                  </div>
                ))}
                
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No tasks yet</p>
                    {column.status === 'todo' && (
                      <p className="text-xs mt-1">Create a new task to get started</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
