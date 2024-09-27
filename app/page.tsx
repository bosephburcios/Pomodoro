import Timer from './components/Timer';
import Menu from './components/Menu';
import './styles/App.css';
import './styles/Menu.css';

function App() {
  return (
    <div className="App">
      <div className="main-container"> 
        <Menu />
        <Timer />
      </div>
    </div>
  );
}

export default App;
