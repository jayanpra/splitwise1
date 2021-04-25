import './App.css';
import Main from './components/Main'
import {BrowserRouter} from 'react-router-dom';


function App() {
  return (
      <BrowserRouter>
        <div className="App" style={{overflow: 'auto', maxHeight:"780px"}}>
        <Main/>
        </div>
      </BrowserRouter>
  );
}

export default App;
