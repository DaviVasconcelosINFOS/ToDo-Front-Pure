import { Task } from './state';
import { LOAD_TASKS, ADD_TASKS, DELETE_TASKS, UPDATE_TASK_STATUS, LOGIN_SUCCESS, LOGOUT } from './actionTypes';

interface LoadTasks {
  type: typeof LOAD_TASKS;
  payload: Task[];
}

interface AddTask {
  type: typeof ADD_TASKS;
  payload: Task;
}

interface UpdateTask {
  type: typeof UPDATE_TASK_STATUS;
  payload: { id: number; updatedTaskData: Partial<Task> };
}

interface DeleteTask {
  type: typeof DELETE_TASKS;
  payload: number;
}

// Auth Action Interfaces
interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
  payload: {
    token: string;
    user: string;
  };
}

interface Logout {
  type: typeof LOGOUT;
}

// Combine all action types into a union
export type TaskActionTypes = LoadTasks | AddTask | UpdateTask | DeleteTask;
export type AuthActionTypes = LoginSuccess | Logout;
