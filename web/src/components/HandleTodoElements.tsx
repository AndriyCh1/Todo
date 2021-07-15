import { Box, Button, makeStyles, TextField } from "@material-ui/core";
import useSWR from "swr";

const useStyles = makeStyles((theme)=>({
    handleElements:{
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
  }));

interface TodoDto {
    id: number;
    description: string;
    completed: boolean;
};


function HandleTodoElements (props: any){ // ????
  const {editId, isEditMode, todoValue, changeEditMode, setTodoValue} = props;
  const classes = useStyles();
  const fetcher = (url: string) => fetch(url).then(r => r.json())
  const {mutate} = useSWR<TodoDto[]>(`http://localhost:3001/todo`, fetcher);

  const createTodo = (todo: string | undefined): void => {
    setTodoValue('');
    
    if (todo){
      fetch(`http://localhost:3001/todo`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        body: JSON.stringify({description: todo}),
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

  return(
      <Box className={classes.handleElements}>
        { !isEditMode ?
          <Button 
            className={classes.button}
            variant="contained"
            onClick={() => {
              createTodo(todoValue);
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
          fullWidth
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)}
        > 
        </TextField>
      </Box>
  )
}

export default HandleTodoElements;
