import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { createGlobalStyle } from 'styled-components';
import TodoList from './TodoList';
import AsteroidGame from './AsteroidGame';
import { darkTheme } from './theme';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    overflow: hidden;
    color: #00ff00;
    font-family: 'Courier New', Courier, monospace;
  }
`;

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Router>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <nav>
            <Link to="/" style={{ color: '#00ff00', marginRight: '20px' }}>Todo List</Link>
            <Link to="/game" style={{ color: '#00ff00' }}>Asteroid Game</Link>
          </nav>
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/game" element={<AsteroidGame />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
