import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled, { createGlobalStyle } from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Existing Todo interface
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Update the dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ff00',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#00ff00',
      secondary: '#00ff00',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    allVariants: {
      color: '#00ff00',
    },
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#00ff00',
          '&.Mui-checked': {
            color: '#00ff00',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#00ff00',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff00',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff00',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00ff00',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#00ff00',
          '&.Mui-focused': {
            color: '#00ff00',
          },
        },
      },
    },
  },
});

// Global styles for Matrix background
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    overflow: hidden;
  }
`;

// Matrix rain canvas
const MatrixCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const AppContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
  }
`;

const StyledListItemText = styled(ListItemText)<{ done: boolean }>`
  && {
    text-decoration: ${(props) => (props.done ? "line-through" : "none")};
    color: #00ff00;
  }
`;

function App() {
  const [todos, setTodos] = useLocalStorageState<Todo[]>("todos", {
    defaultValue: [],
  });
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState(""); // Add this line

  useEffect(() => {
    if (todos.length === 0) {
      const boilerplateTodos = [
        { id: 1, text: "Install Node.js", done: false },
        { id: 2, text: "Install Cursor IDE", done: false },
        { id: 3, text: "Log into Github", done: false },
        { id: 4, text: "Fork a repo", done: false },
        { id: 5, text: "Make changes", done: false },
        { id: 6, text: "Commit", done: false },
        { id: 7, text: "Deploy", done: false },
      ];
      setTodos(boilerplateTodos);
    }
  }, [todos, setTodos]);

  useEffect(() => {
    // Matrix rain animation
    const canvas = document.getElementById('matrixCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }
    
    function draw() {
      if (!ctx) return;
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#0F0";
      ctx.font = fontSize + "px monospace";
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    
    const intervalId = setInterval(draw, 35);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), done: false },
      ]);
      setNewTodo("");
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleEditTodo = (id: number) => {
    setEditingId(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setEditText(todoToEdit.text);
    }
  };

  const handleUpdateTodo = (id: number) => {
    if (editText.trim() !== "") {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText.trim() } : todo
        )
      );
    }
    setEditingId(null);
    setEditText("");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <MatrixCanvas id="matrixCanvas" />
      <AppContainer>
        <Typography variant="h4" component="h1" gutterBottom>
          Matrix Todo List
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="New Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
          autoFocus // Add this line to enable autofocus
          InputProps={{
            style: { color: '#00ff00' },
          }}
        />
        <StyledButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddTodo}
        >
          Add Todo
        </StyledButton>
        <List>
          {todos.map((todo) => (
            <ListItem key={todo.id} dense>
              <Checkbox
                edge="start"
                checked={todo.done}
                onChange={() => handleToggleTodo(todo.id)}
              />
              {editingId === todo.id ? (
                <TextField
                  fullWidth
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleUpdateTodo(todo.id)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleUpdateTodo(todo.id)
                  }
                  autoFocus
                  InputProps={{
                    style: { color: '#00ff00' },
                  }}
                />
              ) : (
                <StyledListItemText primary={todo.text} done={todo.done} />
              )}
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEditTodo(todo.id)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
