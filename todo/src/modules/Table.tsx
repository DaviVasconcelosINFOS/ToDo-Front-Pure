import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import CircleIcon from "@mui/icons-material/Circle";
import { visuallyHidden } from "@mui/utils";
import moment from "moment";
import DetailsDialog from "./TaskDetails";
import { useDispatch, useSelector } from "react-redux";
import { deleteTaskAction, loadTasks, updateTask } from "../redux/action";
import { RootState, AppDispatch } from "../redux/store";
import { AuthState, Task } from "../redux/state";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { TaskStatus } from "../redux/state";
import { PersistPartial } from "redux-persist/es/persistReducer";
import getAllTasks, { deletTask, editTask, getTasksByUserId } from "../services/api";
import { getPayloadData } from "../services/utils";


interface Data {
  id: number;
  status: string;
  inicio: string;
  fim: string;
  titulo: string;
  descricao: string;
  utilizadorId: number | string;
  utilizador: string;
}

function createData(
  id: number,
  status: string,
  inicio: number,
  fim: number,
  titulo: string,
  descricao: string,
  utilizadorId: number | string,
  utilizador: string
): Data {
  return {
    id,
    status: status,
    inicio: moment(inicio).format("YYYY-MM-DD"),
    fim: moment(fim).format("YYYY-MM-DD"),
    titulo,
    descricao,
    utilizadorId,
    utilizador,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data | "acoes" | "utilizador";
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "inicio",
    numeric: false,
    disablePadding: false,
    label: "Início",
  },
  {
    id: "fim",
    numeric: false,
    disablePadding: false,
    label: "Fim",
  },
  {
    id: "titulo",
    numeric: false,
    disablePadding: false,
    label: "Titulo",
  },
  {
    id: "descricao",
    numeric: false,
    disablePadding: false,
    label: "Descrição",
  },
  {
    id: "utilizador",
    numeric: false,
    disablePadding: false,
    label: "Utilizador",
  },
  {
    id: "acoes",
    numeric: false,
    disablePadding: false,
    label: "Ações",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data | "utilizador"
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof Data | "utilizador";
  rowCount: number;
  isAdmin: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    isAdmin,
  } = props;
  const createSortHandler =
    (property: keyof Data | "utilizador") =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells
          .filter((headCell) => !(headCell.id === "utilizador" && !isAdmin))
          .map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.id !== "acoes" ? (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(
                    headCell.id as keyof Data | "utilizador"
                  )}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
      )}
    </Toolbar>
  );
}

export default function EnhancedTable() {
  const dispatch: AppDispatch = useDispatch();
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data | "utilizador">("inicio");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Data | null>(null);
  const [tasksData, setTasksData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);

  const authState = useAppSelector(
    (state: { authState: AuthState & PersistPartial }) => state.authState
  );
  const token = authState.token;

  React.useEffect(() => {
    const fetchTasks = async () => {
      if (token) {
        setLoading(true);
        try {
          const payload = getPayloadData(token);
          let response;
          if (payload.role === "admin") {
            response = await getAllTasks(token);
            setIsAdmin(true);
          } else {
            response = await getTasksByUserId(token, payload.id);
          }
          const rows = response.map((task: Task) =>
            createData(
              task.id,
              getTaskStatus(task),
              task.data_Criacao,
              task.data_Termino,
              task.titulo,
              task.descricao,
              task.user?.id ?? "",
              task.user?.nome ?? ""
            )
          );

          setTasksData(rows);
          dispatch(loadTasks(rows));
          
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTasks();
  }, [dispatch]);

  const getTaskStatus = (task: Task) => {
    if(task.status != 'completed'){
      const now = moment();
      const endDate = moment(task.data_Termino);
      console.info(now.isAfter(endDate));
      if (now.isAfter(endDate)) {
        return "atrazado";
      } else if (endDate.diff(now, "days") <= 2) {
        return "close to end";
      } else {
        return task.status;
      }
    }else{
      return task.status
    }
    
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data | "utilizador"
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = tasksData.map((taskData: Data) => taskData.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    //Função para selecionar row
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasksData.length) : 0;

  const handleDelete = async (id: number) => {
    const responce = deletTask(token, id);
    console.info(responce);
    await deleteTaskAction(id);
    dispatch(deleteTaskAction(id));
    setTasksData(tasksData.filter((task) => task.id !== id));
    //meter a chamda da api
  };

  const handleComplete = async (id: number) => {
    dispatch(updateTask(id, { status: "completed" }));
    try {

      const response = await editTask(token, 
        {
          titulo: null,
          descricao: null,
          data_Termino: null,
          status: "completed",
          user: null
        },
        id
      );
  
      console.info(response);

      setTasksData(
        tasksData.map((task) =>
          task.id === id ? { ...task, status: "completed" } : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleSaveTaskDetails = async (
    id: number,
    updatedTask: Partial<Task>
  ) => {
    dispatch(updateTask(id, updatedTask));
    setTasksData(
      tasksData.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  const handleDetails = (id: number) => {
    const task =
      tasksData.find((task: { id: number }) => task.id === id) || null;
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tasksData.length}
              isAdmin={isAdmin}
            />
            <TableBody>
              {stableSort(tasksData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${row.id}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell align="left">
                        {/* Status icons */}
                        {row.status === "completed" ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircleIcon sx={{ color: "blue", mr: 1 }} />
                            <Typography variant="body2">Concluído</Typography>
                          </Box>
                        ) : row.status === "close to end" ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircleIcon sx={{ color: "yellow", mr: 1 }} />
                            <Typography variant="body2">
                              Próximo do fim
                            </Typography>
                          </Box>
                        ) : row.status === "atrazado" ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircleIcon sx={{ color: "red", mr: 1 }} />
                            <Typography variant="body2">Atrasado</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircleIcon sx={{ color: "green", mr: 1 }} />
                            <Typography variant="body2">Aberto</Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="left">{row.inicio}</TableCell>
                      <TableCell align="left">{row.fim}</TableCell>
                      <TableCell align="left">{row.titulo}</TableCell>
                      <TableCell align="left">{row.descricao}</TableCell>
                      {isAdmin && (
                        <TableCell align="left">{row.utilizador}</TableCell>
                      )}
                      <TableCell align="left">
                        <Tooltip title="Informações">
                          <IconButton onClick={() => handleDetails(row.id)}>
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Concluir">
                          <span>
                            <IconButton
                              onClick={() => handleComplete(row.id)}
                              disabled={row.status === "Completed"}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Deletar">
                          <IconButton onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={isAdmin ? 5 : 6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tasksData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {selectedTask && (
        <DetailsDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSaveTaskDetails}
          taskDetails={selectedTask}
        />
      )}
    </Box>
  );
}
