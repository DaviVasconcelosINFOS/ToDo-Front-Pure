
import React from "react";
import Dashboard from "../../modules/Dashboard";
import ReduxProvider from "../../redux/ReduxProvider";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { useAppSelector } from "../../redux/hooks";
import { AuthState } from "../../redux/state";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const authState = useAppSelector(
    (state: { authState: AuthState & PersistPartial }) => state.authState
  );
  const token = authState.token;
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!token){
      navigate('/');
    }
  }, [token]);


  return (
      <Dashboard />
  );
};

export default Home;
