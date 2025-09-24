import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/stores';
import type { Priority, Task, TaskRequest } from './types/listType';
import { creattask, deletetask, getAlltask, updatetask } from './store/taskSlice';

const App: React.FC = () => {
  // Lấy ra state đúng cấu trúc: task.data / task.status / task.error
  const { data: tasks, status, error } = useSelector((s: RootState) => s.task);

  const dispatch = useDispatch();
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Cao');
  const [taskUpdate, setTaskUpdate] = useState<Task | null>(null);

  const [filters, setFilters] = useState({
    status: 'Tất cả',
    priority: 'Tất cả',
    searchTerm: '',
  });


  useEffect(() => {
    dispatch(getAlltask() as any);
  }, [dispatch]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    if (taskUpdate) {

      dispatch(
        updatetask({
          id: taskUpdate.id,
          changes: {
            taskName: newTaskText,
            priority: newTaskPriority,
          },
        }) as any
      );
      setTaskUpdate(null);
    } else {

      const req: TaskRequest = {
        taskName: newTaskText.trim(),
        priority: newTaskPriority,
        completed: false,
      };
      dispatch(creattask(req) as any);
    }

    setNewTaskText('');
    setNewTaskPriority('Cao');
  };

  const handleToggle = (t: Task) => {
    dispatch(updatetask({ id: t.id, changes: { completed: !t.completed } }) as any);
  };

  const handleDelete = (id: number) => {
    dispatch(deletetask(id) as any);
  };

  const handleStartEdit = (t: Task) => {
    setTaskUpdate(t);
    setNewTaskText(t.taskName);
    setNewTaskPriority(t.priority);
  };

  const handleCancelEdit = () => {
    setTaskUpdate(null);
    setNewTaskText('');
    setNewTaskPriority('Cao');
  };


  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        filters.status === 'Tất cả' ||
        (filters.status === 'Hoàn thành' && task.completed) ||
        (filters.status === 'Chưa hoàn thành' && !task.completed);

      const priorityMatch = filters.priority === 'Tất cả' || task.priority === filters.priority;

      const searchTermMatch = task.taskName.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return statusMatch && priorityMatch && searchTermMatch;
    });
  }, [tasks, filters]);

  return (
    <div className="task-manager-container">
      <h1>Task Manager</h1>


      {status === 'pending' && <div className="loader">Đang xử lý...</div>}
      {error && <div style={{ color: 'red' }}>Lỗi: {error}</div>}


      <form className="card add-task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Công việc mới"
          className="task-input"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <select
          className="priority-select"
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
        >
          <option value="Cao">Cao</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Thấp">Thấp</option>
        </select>

        <button type="submit" className="add-button">
          {taskUpdate ? 'Cập Nhật' : 'Thêm'}
        </button>

        {taskUpdate && (
          <button type="button" style={{ backgroundColor: 'red' }} onClick={handleCancelEdit}>
            Hủy Cập Nhật
          </button>
        )}
      </form>

      {/* Bộ lọc */}
      <div className="card filter-controls">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option>Tất cả</option>
          <option>Hoàn thành</option>
          <option>Chưa hoàn thành</option>
        </select>

        <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
          <option>Tất cả</option>
          <option>Cao</option>
          <option>Trung bình</option>
          <option>Thấp</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
      </div>

      {/* Danh sách */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`card task-item ${task.completed ? 'completed' : ''}`}>
            <input type="checkbox" checked={task.completed} onChange={() => handleToggle(task)} />

            <p className="task-text">{task.taskName}</p>

            <span className={`badge badge-${task.priority.toLowerCase().replace(' ', '-')}`}>
              {task.priority.toUpperCase()}
            </span>

            <button className="icon-button" onClick={() => handleDelete(task.id)}>🗑️</button>
            <button className="icon-button" onClick={() => handleStartEdit(task)}>✏️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
