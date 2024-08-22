import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import HomeAppBar from "../modules/AppBar";
import Table from "../modules/Table";
import Grid from "@mui/material/Grid";
import BasicCard from "../modules/Card";
import { Box } from "@mui/material";
import { loadTasks } from "../redux/action";
import { useAppDispatch, useAppSelector  } from "../redux/hooks";
import { RootState, Task } from "../redux/state";
import { getPayloadData } from "../services/utils";
import getAllTasks, { getTasksByUserId } from "../services/api";
import FabButton from "./Fab";


const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();  
  const tasks = useAppSelector((state: RootState) => state.taskState.tasks);
  const authState = useAppSelector(state => state.authState);
  const token = authState.token;


  const getTaskCountByStatus = (tasks: Task[], statuses: string[]) => {
    return tasks.filter(task => statuses.includes(task.status)).length;
  };

  const openTasks = useMemo(() => getTaskCountByStatus(tasks, ['open', 'close to end']), [tasks]);
  const expiredTasks = useMemo(() => getTaskCountByStatus(tasks, ['atrasado']), [tasks]);
  const completedTasks = useMemo(() => getTaskCountByStatus(tasks, ['completed']), [tasks]);

  return (
    <div>
      <HomeAppBar />
      <div style={{ marginTop: "50px" }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <BasicCard title="Tarefas Abertas" content={openTasks} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <BasicCard title="Tarefas Expiradas" content={expiredTasks} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <BasicCard title="Tarefas Concluídas" content={completedTasks} />
          </Grid>
        </Grid>
      </div>
      <div style={{ marginTop: "15px" }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Box sx={{ width: "100%" }}>
              <Table />
            </Box>
          </Grid>
        </Grid>
      </div>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Grid container justifyContent="center">
          <Grid item>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FabButton />
            </Box>
          </Grid>
        </Grid>
      </div> 
    </div>
  );
};

export default Dashboard;
