import { Route, Routes } from "react-router-dom";
import HomePage from "./home";
import TaskOnePage from "./task1";
import TaskTwoPage from "./task2";
import TaskThreePage from "./task3";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/task-1" element={<TaskOnePage />} />
      <Route path="/task-2" element={<TaskTwoPage />} />
      <Route path="/task-3" element={<TaskThreePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default App;
