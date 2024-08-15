import Dashboard from "../../modules/Dashboard";
import ReduxProvider from "../../redux/ReduxProvider";


const Home = () => {
  return (
    <ReduxProvider>
      <Dashboard />
    </ReduxProvider>
  );
};

export default Home;
