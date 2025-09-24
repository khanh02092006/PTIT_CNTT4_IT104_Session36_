import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Task, TaskRequest, TaskState } from '../types/listType';
import axios from 'axios';

const API = 'http://localhost:8080/tasks';

const initialState: TaskState = {
    data: [],
    status: 'idle',
    error: null,
};



// GET /tasks
export const getAlltask = createAsyncThunk<Task[]>(
    'task/getAlltask',
    async () => {
        const res = await axios.get<Task[]>(API);
        return res.data;
    }
);

// POST /tasks
export const creattask = createAsyncThunk<Task, TaskRequest>(
    'task/creattask',
    async (taskReq) => {
        const res = await axios.post<Task>(API, taskReq);
        return res.data;
    }
);

// PATCH /tasks/:id (toggle & update chung)
export const updatetask = createAsyncThunk<Task, { id: number; changes: Partial<TaskRequest> }>(
    'task/updatetask',
    async ({ id, changes }) => {
        const res = await axios.patch<Task>(`${API}/${id}`, changes);
        return res.data;
    }
);

// DELETE /tasks/:id
export const deletetask = createAsyncThunk<number, number>(
    'task/deletetask',
    async (id) => {
        await axios.delete(`${API}/${id}`);
        return id;
    }
);

// ===== Slice =====
const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // ---- getAlltask
        builder
            .addCase(getAlltask.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(getAlltask.fulfilled, (state, action: PayloadAction<Task[]>) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(getAlltask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Lỗi tải danh sách';
            });

        // ---- creattask
        builder
            .addCase(creattask.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(creattask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
            })
            .addCase(creattask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Lỗi tạo task';
            });

        // ---- updatetask
        builder
            .addCase(updatetask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.status = 'succeeded';
                const idx = state.data.findIndex((t) => t.id === action.payload.id);
                if (idx !== -1) state.data[idx] = action.payload;
            })
            .addCase(updatetask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Lỗi cập nhật task';
            });

        // ---- deletetask
        builder
            .addCase(deletetask.fulfilled, (state, action: PayloadAction<number>) => {
                state.status = 'succeeded';
                state.data = state.data.filter((t) => t.id !== action.payload);
            })
            .addCase(deletetask.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Lỗi xoá task';
            });
    },
});

export default taskSlice.reducer;
