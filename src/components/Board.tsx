
import { useState } from 'react';
import { useTasks } from '@/context/TaskContext';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';

export const Board = () => {
  const { columns, moveTask, createTask } = useTasks();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (!taskId || !draggedTask) return;

    moveTask(taskId, targetColumnId);
    setDraggedTask(null);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
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
          <CreateTaskModal onCreateTask={createTask} />
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
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    draggable
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
