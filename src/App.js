
import React from 'react';
import { TaskProvider } from './context/TaskContext';
import KanbanBoard from './components/KanbanBoard';
import Header from './components/Header';
import './App.css';


function App() {
  return (
    <TaskProvider>
      <div className="kanban-board min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <KanbanBoard />
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;