import React, { useState, useEffect } from 'react';
import { Box, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getPayloadData } from "../services/utils";
import { useAppSelector } from '../redux/hooks';
import getAllTasks, { addTask, getAllUsers, getTasksByUserId } from '../services/api';
import { isDataView } from 'util/types';

const FabButton = () => {
  const [open, setOpen] = useState(false);
  const [taskData, setTaskData] = useState({ status: '', fim: '', titulo : '',descricao: '', utilizador: ''});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<number>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [id_user, setIdUser] = useState();
  const authState = useAppSelector(state => state.authState);
  const token = authState.token;


  useEffect(() => {
    const fetchdata = async () => {
      if (token) {
        console.log('Token:', token);
        const payload = getPayloadData(token);
  
        if (payload.role === "admin") {
          setIsAdmin(true);
          const result = await getAllUsers(token);
          setUsers(result);
        }
      }
    };
  
    fetchdata();
  }, [token]);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSubmit = () => {
    try{
      if (isAdmin){
        const finalTaskData = { ...taskData, utilizador: selectedUser };
        const result = addTask(token, {
          titulo : finalTaskData.titulo,
          descricao : finalTaskData.descricao,
          data_Termino : finalTaskData.fim,
          status : 'open',
          user : {
            id : finalTaskData.utilizador
          }


        })
      }else{
        if (token){
          const payload = getPayloadData(token);
          const finalTaskData = { ...taskData,  payload};
          const result = addTask(token, {
            titulo : finalTaskData.titulo,
            descricao : finalTaskData.descricao,
            data_Termino : finalTaskData.fim,
            status : 'open',
            user : {
              id : finalTaskData.payload.id
            }
          })
        }
        
      }
      handleClose();
      window.location.reload()
    }catch(erro){
        console.error(erro)
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUser(parseInt(userId));
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="fim"
            label="Fim"
            fullWidth
            type="date"
            variant="outlined"
            value={taskData.fim}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="titulo"
            label="Titulo"
            fullWidth
            variant="outlined"
            value={taskData.titulo}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="descricao"
            label="Descrição"
            fullWidth
            variant="outlined"
            value={taskData.descricao}
            onChange={handleChange}
          />
          {isAdmin && (
            <Box mt={2} height={300} width="100%">
              <DataGrid
                rows={users}
                columns={columns}
                onRowClick={(params: { row: { id: any; }; }) => handleUserSelection(params.row.id)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Adicionar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FabButton;
