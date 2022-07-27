import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import CreateReport from './components/CreateReport';
import AllReports from './components/AllReports';
import Header from './components/Header';
import ReportContainer from "./components/ReportContainer";
import Settings from "./components/Settings/Settings";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='/izvestaji/:reportID' element={<ReportContainer />} />
          <Route path='/izvestaji' element={<AllReports />} />
          <Route path='/podesavanja' element={<Settings />} />
          <Route path='/' element={<CreateReport />} />
        </Routes>
      </Router>
    </div >
  );
}

export default App;
