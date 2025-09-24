

export type Priority = 'Cao' | 'Trung bình' | 'Thấp';

export interface Task {
    id: number;
    taskName: string;
    completed: boolean;
    priority: Priority;
}

// Khi gọi API tạo/sửa, thường không cần id
export type TaskRequest = Omit<Task, 'id'>;

export interface TaskState {
    data: Task[];
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}
