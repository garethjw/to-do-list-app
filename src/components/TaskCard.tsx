
import { format } from 'date-fns';
import { Calendar, User, Clock } from 'lucide-react';
import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCard = ({ task, isDragging }: TaskCardProps) => {
  const formatDate = (date: Date | null) => {
    return date ? format(date, 'MMM dd, yyyy') : 'Not set';
  };

  const getPriorityColor = () => {
    if (!task.shipDate) return 'bg-gray-100 text-gray-800';
    const now = new Date();
    const daysUntilShip = Math.ceil((task.shipDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilShip < 0) return 'bg-red-100 text-red-800';
    if (daysUntilShip <= 3) return 'bg-orange-100 text-orange-800';
    if (daysUntilShip <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card 
      className={`mb-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md ${
        isDragging ? 'rotate-2 shadow-lg' : ''
      }`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2">
          {task.summary}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-700">{task.assignee}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">Created: {formatDate(task.createdDate)}</span>
          </div>
          
          {task.startDate && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-gray-600">Started: {formatDate(task.startDate)}</span>
            </div>
          )}
          
          {task.shipDate && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-green-500" />
              <span className="text-xs text-gray-600">Ship: {formatDate(task.shipDate)}</span>
            </div>
          )}
        </div>

        <Badge className={`text-xs ${getPriorityColor()}`}>
          {task.shipDate ? 
            `Due ${format(task.shipDate, 'MMM dd')}` : 
            'No due date'
          }
        </Badge>
      </CardContent>
    </Card>
  );
};
