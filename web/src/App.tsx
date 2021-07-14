import { AppBar, Box, Button, Container, Grid, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import useSWR from 'swr';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// 1. Фільтрація по "Видалені" "Завершені" "Наявні" (AppBar, ...)
// 2. Стилізація

  const useStyles = makeStyles((theme)=>({
    taskPanel:{
      display:"flex",
      alignItems:"center",
      margin:"10px 0",
    },

    textField: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginRight: theme.spacing(2),

    },

    button:{
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginRight: theme.spacing(2),
      fontSize: "13px",
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },

  }));

export interface TodoDto {
  id: number;
  description: string;
  completed: boolean;
};

function App() {
  const classes = useStyles();
  const [todoValue, setTodoValue] = useState<string>("");
  const [isEditMode, changeEditMode] = useState<boolean>(false);
  const [tableType, changeTableType] = useState<string>("current");
  const [editId, setEditId] = useState<number>(-1);

  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const {data: todos, error, mutate} = useSWR<TodoDto[]>(`http://localhost:3001/todo`, fetcher);
  const {data: deletedTodos, error: errorDeletedTodos , mutate: mutateDeletedTodos} = useSWR<TodoDto[]>(`http://localhost:3001/todo/deleted`, fetcher);
  

  const createTodo = (todo: string | undefined): void => {
    if (todo){
      fetch(`http://localhost:3001/todo`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({description: todo}),
      }).then(() => {
        mutate();
      });}
  }

  const deleteTodo = (id: number): void => {
    if (id >= 0){
      fetch(`http://localhost:3001/todo/${id}`, {
        method: 'DELETE'
      }).then(() => {
        mutate();
        mutateDeletedTodos();
      });}
  }

  const updateTodo = (id: number): void => {
    changeEditMode(false);
    setTodoValue('');
    if (id >= 0){
      fetch(`http://localhost:3001/todo/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({description: `${todoValue}`}),
      }).then(() => {
        mutate();
      });}
  }

  const completeTodo = (id: number): void => {
    if (id >= 0){
      fetch(`http://localhost:3001/todo/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({description: todos ? todos[id].description: "", completed: true}), //????
      }).then(() => {
        mutate();
      });}
  }

  const MainActionButton = (id: number) => {
    return(
      <>
      <DoneIcon 
        onClick={() => completeTodo(id)}
        style={{marginRight:"20px"}}
      />
      <EditIcon 
        onClick={() => {
          changeEditMode(true);
          setEditId(id);
          setTodoValue(todos ? todos[id].description : "")
        }}
      />
    </>
    )
  }

  const DeleteActionButton = (id: number) => {
    return(
      <DeleteIcon 
        onClick={() => deleteTodo(id)}
      />
    )
  } 

  const columns = ["Завдання", "Дія"];

  const getCurrentTodos = () => {
    const data: any = [];
    todos?.forEach((el, index) => {
      if (!el.completed){
        data.push([el.description, MainActionButton(index)]);
      }
    })
    return data;
  }

  const getCompletedTodos = () => {
    const data: any = [];
    todos?.forEach((el, index) => {
      if (el.completed){
        data.push([el.description, DeleteActionButton(index)]);
      }
    })
    return data;
  }

  const getDeletedTodos = () => { 
    const data: any = [];
    deletedTodos?.forEach(el => {
      data.push([el.description]);
    })
    return data;
  }

  const options = {
    download: false,
    filter: false,
    print: false,
    viewColumns: false,
    tableBodyHeight: '50vh',
    selectableRowsHideCheckboxes: true,
    selectableRowsOnClick: false,
  }

  return (
    <Container maxWidth="lg"> 
      <Box className={classes.taskPanel} >

        { !isEditMode ? <Button 
          className={classes.button}
          variant="contained"
          onClick={() => createTodo(todoValue)}
          >
          Додати
        </Button>:
        <><Button 
          className={classes.button}
          variant="contained"
          onClick={() => {
            updateTodo(editId);
            changeEditMode(false);
          }}
          >
          Зберегти
        </Button>
        <Button 
          className={classes.button}
          variant="contained"
          onClick={() => {
            setTodoValue("");
            changeEditMode(false);
          }}
          >
          Скасувати
        </Button>
        </>}

        <TextField
          className={classes.textField}
          variant="outlined"
          placeholder="Введіть завдання"
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)}
        > 
        </TextField>

        <Box>
          <Button 
          className={classes.button}
          variant="contained"
          onClick={() => changeTableType("current")}
          >
          Усі завдання
        </Button>
        <Button 
          className={classes.button}
          variant="contained"
          onClick={() => changeTableType("completed")}
          >
          Завершені
        </Button>
        <Button // 1
          className={classes.button}
          variant="contained"
          onClick={() => changeTableType("deleted")}
          >
          Видалені
        </Button>
        </Box>
      </Box>

      <MUIDataTable
        title={"Список завдань"}
        data={  tableType === "current" ? getCurrentTodos() : 
                tableType === "completed" ? getCompletedTodos() : 
                getDeletedTodos() }
        columns={tableType === "deleted" ? ["Завдання"] : columns}
        options= {options}
        />
    </Container>
  );
}

export default App;
