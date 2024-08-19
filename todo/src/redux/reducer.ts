import { TaskState, AuthState
} from './state';
import { TaskActionTypes, AuthActionTypes } from './types';
import { LOAD_TASKS, ADD_TASKS, DELETE_TASKS, UPDATE_TASK_STATUS, LOGIN_SUCCESS, LOGOUT } from './actionTypes';
import { combineReducers } from 'redux';

const initialTaskState: TaskState = {
  tasks: [],
  counters: {
    open: 0,
    completed: 0,
    atrazado: 0,
  },
};

const initialAuthState: AuthState = {
  token: null,
  user: null,
};

// Task Reducer
export const taskReducer = (state = initialTaskState, action: TaskActionTypes): TaskState => {
  switch (action.type) {
    case LOAD_TASKS:
      const newCounters = {
        open: action.payload.filter((task) => task.status === 'open' || 'close to end').length,
        completed: action.payload.filter((task) => task.status === 'completed').length,
        atrazado: action.payload.filter((task) => task.status === 'atrazado').length,
      };
      return {
        ...state,
        tasks: action.payload,
        counters: newCounters,
      };

    case ADD_TASKS:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        counters: {
          ...state.counters,
          [action.payload.status]: state.counters[action.payload.status] + 1,
        },
      };

    case DELETE_TASKS:
      const taskToRemove = state.tasks.find((task) => task.id === action.payload);
      if (!taskToRemove) return state;

      const remainingTasks = state.tasks.filter((task) => task.id !== action.payload);
      return {
        ...state,
        tasks: remainingTasks,
        counters: {
          ...state.counters,
          [taskToRemove.status]: state.counters[taskToRemove.status] - 1,
        },
      };
      
      case UPDATE_TASK_STATUS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updatedTaskData }
            : task
        ),
      };

    default:
      return state;
  }
};

// Auth Reducer
export const authReducer = (state = initialAuthState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };

    case LOGOUT:
      return initialAuthState;

    default:
      return state;
  }
};

