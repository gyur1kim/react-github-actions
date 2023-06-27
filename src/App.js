import './App.css';
import {useState} from 'react';

function App() {
  // ESLint Error 발생
  // hello();
  // let hello = () => console.log(hello);
  const [count, setCount] = useState(0);
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <h3 data-testid="counter">{count}</h3>
        <div>
          <button
            data-testid="minus-button"
            disabled={disabled}
            onClick={() => setCount(prev => prev-1)}
          >-</button>
          <button
            data-testid="plus-button"
            disabled={disabled}
            onClick={() => setCount(prev => prev+1)}
          >+</button>
          <button
            data-testid="on/off-button"
            style={{backgroundColor: "blue"}}
            onClick={() => setDisabled(prev => !prev)}
          >On/Off</button>
        </div>
      </header>
    </div>
  );
}

export default App;
