import { Box, Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme)=>({
    filterButton:{
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginRight: theme.spacing(2),
      fontSize: "13px",
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.success.dark
    },
  }));
  
function FilterButtons(props: any){ //????
    const classes = useStyles();
    const {changeTableType} = props;

    return(
        <Box>
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
            <Button 
                className={classes.filterButton}
                variant="contained"
                onClick={() => changeTableType("inProcess")}
            >
                Виконуються
            </Button>
        </Box>
    )
}

export default FilterButtons;