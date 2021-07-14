import { Box, Button, Container,  TextField, Toolbar, Typography } from '@material-ui/core';
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import useSWR from 'swr';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { green, orange, red } from '@material-ui/core/colors';
import Datatable from './Datatable';


  const useStyles = makeStyles((theme)=>({
    taskPanel:{
      display:"flex",
      alignItems:"center",
      margin:"10px 0",
      justifyContent: "space-between",
    },

    inputElements:{
      display:"flex",
      alignItems:"center",
      width:"60%",
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

    filterButton:{
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginRight: theme.spacing(2),
      fontSize: "13px",
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.success.dark,
    },

  }));

export interface TodoDto {
  id: number;
  description: string;
  completed: boolean;
};

function App(): JSX.Element {
  const classes = useStyles();
  const [todoValue, setTodoValue] = useState<string>("");
  const [isEditMode, changeEditMode] = useState<boolean>(false);
  const [tableType, changeTableType] = useState<string>("all");
  const [editId, setEditId] = useState<number>(-1);

  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const {data: todos, error, mutate} = useSWR<TodoDto[]>(`http://localhost:3001/todo`, fetcher);

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

  const MainActionButton = (id: number, isCompleted: boolean): JSX.Element => {
    return(
      <>
      {isCompleted ? 
      <DoneIcon 
        style={{
            cursor: "pointer", 
            marginRight:"20px",
            color: green[500], 
            fontSize: 30}}
      /> :
      <>
      <DoneIcon 
        onClick={() => completeTodo(id)}
        style={{
          cursor: "pointer",
          marginRight:"20px", 
          fontSize: 30}}
      />
      <EditIcon 
        style={{
          cursor: "pointer", 
          marginRight:"20px", 
          color: orange[500], 
          fontSize: 30}}
        onClick={() => {
          changeEditMode(true);
          setEditId(id);
          setTodoValue(todos ? todos[id].description : "")
        }}
      />
      </>
      }
      <DeleteIcon 
        style={{
          cursor: "pointer", 
          marginRight:"20px",
          color: red[500], 
          fontSize: 30}}
        onClick={() => deleteTodo(id)}
      />
    </>
    )
  }

  const getAllTodos = (): [string, JSX.Element][] => {
    const data: [string, JSX.Element][] = []; 

    todos?.forEach((el, index) => {
        const isCompleted: boolean = el.completed;
        data.push([el.description, MainActionButton(index, isCompleted)]);
    });

    return data;
  }

  const getCompletedTodos = (): string[][] => {
    const data: string[][] = [];

    todos?.forEach((el) => {
      if (el.completed){
        data.push([el.description, "Mb date & time"]);
      }
    });

    return data;
  }

  const getInProcessTodos = (): string[][] => { 
    const data: string[][] = [];

    todos?.forEach((el) => {
      if (!el.completed){
        data.push([el.description, "Mb date & time"]);
      }
    });

    return data;
  }

  // const columns = [
  //   'Опис',
  //   {
  //     name: '',
  //     label: '',
  //     options: {
  //       setCellProps: () => ({
  //         align: 'right',
  //       }),
  //     },
  //   },
  // ];

  // const options = {
  //   download: false,
  //   filter: false,
  //   print: false,
  //   viewColumns: false,
  //   tableBodyHeight: '50vh',
  //   selectableRowsHideCheckboxes: true,
  //   selectableRowsOnClick: false,
  // }
  const data = tableType === "all" ? getAllTodos() : 
               tableType === "completed" ? getCompletedTodos() : 
               getInProcessTodos()

  return (
    <Container maxWidth="lg"> 
      <Box className={classes.taskPanel} >
        <Box className={classes.inputElements}>
        { !isEditMode ? <Button 
          className={classes.button}
          variant="contained"
          onClick={() => {
            createTodo(todoValue);
            setTodoValue("");
          }}
          >
          Додати
        </Button> :
        <><Button 
          className={classes.button}
          variant="contained"
          onClick={() => {
            updateTodo(editId);
            changeEditMode(false);
            setTodoValue("");
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
            setTodoValue("");
          }}
          >
          Скасувати
        </Button>
        </>}

        <TextField
          className={classes.textField}
          variant="outlined"
          placeholder="Введіть завдання"
          fullWidth
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)}
        > 
        </TextField>
        </Box>
        <Box >
          <Button 
          className={classes.filterButton}
          variant="contained"
          onClick={() => changeTableType("all")}
          >
          Усі завдання
        </Button>
        <Button 
          className={classes.filterButton}
          variant="contained"
          onClick={() => changeTableType("completed")}
          >
          Завершені
        </Button>
        <Button // 1
          className={classes.filterButton}
          variant="contained"
          onClick={() => changeTableType("inProcess")}
          >
          Виконуються
        </Button>
        </Box>
      </Box>

        {/* <MUIDataTable
          title={"Список завдань"}
          data={data}
          columns={columns}
          options= {options}
          /> */}

    <Datatable data={data}/>

    </Container>
  );
}

export default App;
