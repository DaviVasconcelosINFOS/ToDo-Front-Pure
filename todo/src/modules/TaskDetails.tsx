import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { Task, TaskStatus } from "../redux/state";
import { useAppSelector } from "../redux/hooks";
import { getPayloadData } from "../services/utils";
import { editTask } from "../services/api";
import moment from "moment";

interface DetailsDialogProps {
  open: boolean;
  onClose: () => void;
  taskDetails: {
    id: number;
    status: string;
    inicio: string;
    fim: string;
    titulo: string;
    descricao: string;
    utilizadorId: number | string;
    utilizador: string | string;
  };
  onSave: (id: number, updatedTask: Partial<Task>) => void;
}

const statusOptions: { [key: string]: string } = {
  open: "Pendente",
  completed: "Concluída",
  atrasado: "Atrasado",
};

const statusReverseOptions: { [key: string]: TaskStatus } = {
  Pendente: "open",
  Concluída: "completed",
  Atrasado: "atrasado",
};

const DetailsDialog: React.FC<DetailsDialogProps> = ({
  open,
  onClose,
  taskDetails,
  onSave,
}) => {
  const [editedTask, setEditedTask] = useState(taskDetails);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authState = useAppSelector((state) => state.authState);

  const token = authState.token;

  const handleSave = () => {
    try {
      const updatedTask: Partial<Task> = {
        ...editedTask,
        status: statusReverseOptions[
          statusOptions[editedTask.status]
        ] as TaskStatus, // Converte o status para o tipo esperado
      };
      onSave(taskDetails.id, updatedTask);

      const formattedFim = moment(editedTask.fim).format("YYYY-MM-DD");
      editTask(
        token,
        {
          titulo: taskDetails.titulo,
          descricao: taskDetails.descricao,
          data_Termino: formattedFim,
          status: updatedTask.status,
          user: null,
        },
        taskDetails.id
      );
      onClose();
    } catch {
      console.error("Falha ao editar Tarefa");
    }
  };

  React.useEffect(() => {
    if (token) {
      const payload = getPayloadData(token);
      if (payload.role === "admin") {
        setIsAdmin(true);
      }
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "fim" && moment(value).isBefore(editedTask.inicio)) {
      setError("A data de término não pode ser anterior à data de início.");
    } else {
      setError(null);
      setEditedTask((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalhes da Tarefa</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          <strong>Status:</strong>
        </Typography>
        <Typography variant="body2">
          {statusOptions[editedTask.status]}
        </Typography>

        <Typography variant="body1">
          <strong>Início:</strong>
        </Typography>
        <TextField
          name="inicio"
          type="date"
          value={editedTask.inicio}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          disabled
        />

        <Typography variant="body1">
          <strong>Fim:</strong>
        </Typography>
        <TextField
          name="fim"
          type="date"
          value={editedTask.fim}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          error={Boolean(error)}
          helperText={error}
        />

        <Typography variant="body1">
          <strong>Título:</strong>
        </Typography>
        <TextField
          name="titulo"
          value={editedTask.titulo}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          multiline
          rows={4}
        />

        <Typography variant="body1">
          <strong>Descrição:</strong>
        </Typography>
        <TextField
          name="descricao"
          value={editedTask.descricao}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          multiline
          rows={4}
        />

        <Typography
          variant="body1"
          style={{ visibility: isAdmin ? "visible" : "hidden" }}
        >
          <strong>Utilizador:</strong>
        </Typography>
        <TextField
          name="utilizador"
          value={editedTask.utilizadorId}
          onChange={handleInputChange}
          fullWidth
          margin="dense"
          style={{ visibility: isAdmin ? "visible" : "hidden" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={Boolean(error)}
        >
          Salvar
        </Button>
      </DialogActions>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default DetailsDialog;
