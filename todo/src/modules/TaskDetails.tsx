import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Task, TaskStatus } from "../redux/state";
import { useAppSelector } from '../redux/hooks';
import { getPayloadData } from '../services/utils';

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  taskDetails: {
    id: number;
    status: string;
    inicio: string;
    fim: string;
    descricao: string;
    utilizadorId: number | string;
    utilizador: string | string;
  };
  onSave: (id: number, updatedTask: Partial<Task>) => void;
}

const statusOptions: { [key: string]: string } = {
  'open': 'Pendente',
  'completed': 'Concluída',
  'expired': 'Expirada'
};

const statusReverseOptions: { [key: string]: 'open' | 'completed' | 'expired' } = {
  'Pendente': 'open',
  'Concluída': 'completed',
  'Expirada': 'expired'
};

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onClose, taskDetails, onSave }) => {
  const [editedTask, setEditedTask] = useState(taskDetails);
  const [isAdmin, setIsAdmin] = useState(false);
  const authState = useAppSelector(state => state.authState);
  const token = authState.token;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedTask = {
      ...editedTask,
      status: statusReverseOptions[statusOptions[editedTask.status] as keyof typeof statusReverseOptions] 
    };
    onSave(taskDetails.id, updatedTask);
    onClose();
  };

  React.useEffect(() => {
    if (token){
      const payload = getPayloadData(token);

      if(payload.role === 'admin'){
        setIsAdmin(true)
      }
    }
    

  }, [token]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes da Tarefa</DialogTitle>
      <DialogContent>
        <Typography variant="body1"><strong>Status:</strong></Typography>
        <TextField
          select
          name="status"
          value={statusOptions[editedTask.status]}
          onChange={(e) => {
            const value = e.target.value as keyof typeof statusReverseOptions;
            setEditedTask((prev) => ({
              ...prev,
              status: statusReverseOptions[value]
            }));
          }}
          fullWidth
          margin="dense"
        >
          {Object.entries(statusOptions).map(([key, label]) => (
            <MenuItem key={key} value={label}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="body1"><strong>Início:</strong></Typography>
        <TextField
          name="inicio"
          type="date"
          value={editedTask.inicio}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />

        <Typography variant="body1"><strong>Fim:</strong></Typography>
        <TextField
          name="fim"
          type="date"
          value={editedTask.fim}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
        />

        <Typography variant="body1"><strong>Descrição:</strong></Typography>
        <TextField
          name="descricao"
          value={editedTask.descricao}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          multiline
          rows={4}
        />

        <Typography variant="body1" style={{ visibility: isAdmin ? 'visible' : 'hidden' }}><strong>Utilizador:</strong></Typography>
        
        <TextField
          name="utilizador"
          value={editedTask.utilizadorId}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          style={{ visibility: isAdmin ? 'visible' : 'hidden' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsDialog;
