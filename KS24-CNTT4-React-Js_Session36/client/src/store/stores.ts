import { configureStore } from '@reduxjs/toolkit';
import taskSlice from "../store/taskSlice"

export const store = configureStore({
    reducer: {
        task: taskSlice,
    },
});

// types cho useSelector, useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
