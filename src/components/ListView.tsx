import { useTasks } from '@/context/TaskContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const ListView = () => {
  const { columns } = useTasks();
  const allTasks = columns.flatMap(column => column.tasks);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Task List</h1>
            <p className="text-gray-600">All your tasks in one place</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Summary</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ship Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.summary}</TableCell>
                  <TableCell>{task.assignee}</TableCell>
                  <TableCell>
                    <Badge variant={
                      task.status === 'todo' ? 'secondary' :
                      task.status === 'inprogress' ? 'default' :
                      'outline'
                    }>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.shipDate ? new Date(task.shipDate).toLocaleDateString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
