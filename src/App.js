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

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path='izvestaji' element={<AllReports />}></Route>
          <Route path='/' element={<CreateReport />}></Route>
        </Routes>
      </Router>
    </div >
  );
}

export default App;
