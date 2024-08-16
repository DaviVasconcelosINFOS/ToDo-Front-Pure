export type TaskStatus = "open" | "completed" | "expired";

export interface Task {
  id: number;
  titulo:string;
  data_Inicio: number;
  data_Termino: number;
  descricao: string;
  status: TaskStatus;
  user: User | null; 
}

export interface User {
  id: number | null;
  nome: string | null;
}

export interface TaskState {
  tasks: Task[];
  counters: {
    open: number,
    completed: number,
    expired: number,
  }
}


export interface AuthState {
  token: string | null;
  user: string | null;
}

export interface RootState {
  taskState: TaskState;
  authState: AuthState;
}
