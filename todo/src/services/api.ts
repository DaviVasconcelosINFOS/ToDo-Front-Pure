import axios, { AxiosResponse } from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const URL = 'http://localhost:8080'


export default async function getAllTasks(token: string) {
  if (!token) {
    throw new Error('Token não fornecido.');
  }
  try {
    const response = await axios({
      method: 'get',
      url: `${URL}/api/tasks/findAll`,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    return response.data.data;
  } catch (errorr) {
    console.error('Erro ao obter todas as tarefas:');
    throw new Error('Não foi possível obter as tarefas.');
  }
}

  export async function getTasksByUserId(token : string,userId: number) {
    if (!token) {
      throw new Error('Token não fornecido.');
    }

    try { 
      const response = await axios({
        method: 'get',
        url: `${URL}/api/tasks/${userId}`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      return response.data.data;
      
    } catch (error) {
      console.error(`Erro ao obter tarefas para o usuário ${userId}:`, error);
      throw new Error('Não foi possível obter as tarefas para o usuário.');
    }
  }

export async function login(email: string, password: string) {
  try {
    const response = await axios.post( `${URL}/auth/login`, {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Não foi possível fazer login.');
  }
}

export async function signUpApi(email: string, password: string, nome : string) {
    try {
      const response = await axios({
        method: 'post',
        url: `${URL}/auth/register`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data:{
          nome : nome,
          email : email,
          password : password,
        }
      }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar novo usuário:', error);
      throw new Error('Não foi possível registrar o usuário.');
    }
  }

  export async function getAllUsers(token : string | null) {
    try {

      const response = await axios({
        method: 'get',
        url: `${URL}/api/users`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw new Error('Não foi possível obter os usuários.');
    }
  }

  export async function getUserById(token : string | null, id : number) {
    try { 
      const response = await axios.get(`${URL}/api/users/${id}`,
        {
          headers : {
            'Authorization' : `Bearer: ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw new Error('Não foi possível obter os usuários.');
    }
  }

  export async function test(token : string | null, id : number) {
    try { 
      const response = await axios.get(`${URL}/api/users/${id}`,
        {
          headers : {
            'Authorization' : `Bearer: ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw new Error('Não foi possível obter os usuários.');
    }
  }

  export async function addTask(token : string | null, data : any) {
    try {

      const response = await axios({
        method: 'post',
        url: `${URL}/api/tasks/add`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data : data
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw new Error('Não foi possível obter os usuários.');
    }
  }

  export async function editTask(token : string | null, data : any, id : number) {
    try {

      const response = await axios({
        method: 'put',
        url: `${URL}/api/tasks/edit/${id}`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data : data
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw new Error('Não foi possível editar as tasks.');
    }
  }

  export async function deletTask(token : string | null, id : number) {
    try {

      const response = await axios({
        method: 'delete',
        url: `${URL}/api/tasks/delete/${id}`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Erro ao obter todos os usuários:', error);
      throw new Error('Não foi possível eleminar a task.');
    }
  }


