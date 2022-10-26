import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import CreateSchedule from './components/CreateSchedule';
import Header from './components/Header';
import ScheduleContainer from "./components/ScheduleContainer";
import Settings from "./components/Settings/Settings";
import AllSchedules from "./components/AllSchedules";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/rasporedi/:scheduleID' element={<ScheduleContainer />} />
          <Route path='/rasporedi' element={<AllSchedules />} />
          <Route path='/podesavanja' element={<Settings />} />
          <Route path='/' element={<CreateSchedule />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
