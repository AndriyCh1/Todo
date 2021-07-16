import { Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useState } from 'react';
import useSWR from 'swr';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { green, orange, red } from '@material-ui/core/colors';
import Datatable from './Datatable';
import HandleTodoElements from './HandleTodoElements';
import FilterButtons from './FilterButtons';


const useStyles = makeStyles((theme)=>({
  handlePanel:{
    display:"flex",
    alignItems:"center",
    margin:"10px 0",
    justifyContent: "space-between",
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

interface TodoDto {
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

  const deleteTodo = (id: number): void => {
    if (id >= 0){
      fetch(`http://localhost:3001/todo/${id}`, {
        method: 'DELETE'
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

 

  const getAllTodos = (): [string, JSX.Element][] => {
    const data: [string, JSX.Element][] = []; 

    todos?.forEach((el, index) => {
        const isCompleted: boolean = el.completed;
        data.push([el.description, MainActionButton(index, isCompleted)]);
    });

    return data;
  }

  const getCompletedTodos = (): [string, JSX.Element][] => {
    const data: [string, JSX.Element][] = [];

    todos?.forEach((el) => {
      if (el.completed){
        data.push([el.description, MainActionButton(el.id, false)]);
      }
    });

    return data;
  }

  const getInProcessTodos = ():[string, JSX.Element][] => { 
    const data: [string, JSX.Element][] = [];

    todos?.forEach((el) => {
      if (!el.completed){
        data.push([el.description, MainActionButton(el.id, false)]);
      }
    });

    return data;
  }

  const MainActionButton = (id: number, isCompleted: boolean): JSX.Element => {
    if (tableType == "completed"){
      return(
        <DeleteIcon 
        style={{
          cursor: "pointer", 
          marginRight:"20px",
          color: red[500], 
          fontSize: 30}}
        onClick={() => deleteTodo(id)}
      />
      )
    }

    return(
      <>
      { isCompleted ? 
      <DoneIcon 
        style={{
            marginRight:"20px",
            color: green[500], 
            fontSize: 30}}
      /> :

      <>
      <DoneIcon 
        style={{
          cursor: "pointer",
          marginRight:"20px", 
          fontSize: 30}}
        onClick={() => completeTodo(id)}
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
          setTodoValue(todos ? todos[id].description : "");
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

  const data:[string, JSX.Element][] = tableType === "all" ? getAllTodos() : 
               tableType === "completed" ? getCompletedTodos() : getInProcessTodos()

  return(
    <Container maxWidth="lg"> 
        <Box className={classes.handlePanel}>
          <HandleTodoElements
              editId = {editId}
              isEditMode = {isEditMode}
              todoValue = {todoValue}
              changeEditMode = {changeEditMode}
              setTodoValue = {setTodoValue}
          />
          <FilterButtons changeTableType={changeTableType}/>
        </Box>
        <Datatable data={data}/>
    </Container>
  );
}

export default App;