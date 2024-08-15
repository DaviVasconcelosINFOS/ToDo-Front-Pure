import { Task } from './state';
import { LOAD_TASKS, ADD_TASKS, DELETE_TASKS, UPDATE_TASK_STATUS, LOGIN_SUCCESS, LOGOUT } from './actionTypes';
import { TaskActionTypes, AuthActionTypes } from './types';

// Task Actions
export const loadTasks = (tasks: Task[]): TaskActionTypes => ({
  type: LOAD_TASKS,
  payload: tasks,
});

export const addTask = (newTask: Task): TaskActionTypes => ({
  type: ADD_TASKS,
  payload: newTask,
});

export const updateTask = (id: number, updatedTaskData: Partial<Task>): TaskActionTypes => ({
  type: UPDATE_TASK_STATUS,
  payload: { id, updatedTaskData },
});

export const deleteTaskAction = (id: number): TaskActionTypes => ({
  type: DELETE_TASKS,
  payload: id,
});

// Auth Actions
export const loginSuccess = (token: string, user: string): AuthActionTypes => ({
  type: LOGIN_SUCCESS,
  payload: { token, user },
});

export const logout = (): AuthActionTypes => ({
  type: LOGOUT,
});
