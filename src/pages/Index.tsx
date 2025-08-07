import { useState } from 'react';
import { Board } from '@/components/Board';
import { ListView } from '@/components/ListView';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LayoutDashboard, List } from "lucide-react"

const Index = () => {
  const [view, setView] = useState('board');

  return (
    <div>
      <div className="p-6">
        <ToggleGroup
          type="single"
          defaultValue="board"
          onValueChange={(value) => {
            if (value) setView(value)
          }}
          className="flex justify-center"
        >
          <ToggleGroupItem value="board" aria-label="Toggle board view">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Board
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="Toggle list view">
            <List className="h-4 w-4 mr-2" />
            List
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {view === 'board' ? <Board /> : <ListView />}
    </div>
  );
};

export default Index;
