export type TaskStatus = 'open' | "completed" | "atrasado";

export interface Task {
  id: number;
  titulo:string;
  data_Criacao: number;
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
    atrasado: number,
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
