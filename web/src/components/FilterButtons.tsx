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
  

interface IFilterButtonsProps{
    changeTableType: React.Dispatch<React.SetStateAction<string>>
}

function FilterButtons({changeTableType}: IFilterButtonsProps){
    const classes = useStyles();

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
                onClick={() => changeTableType("inProcess")}
            >
                Виконуються
            </Button>
            <Button 
                className={classes.filterButton}
                variant="contained"
                onClick={() => changeTableType("completed")}
            >
                Завершені
            </Button>

        </Box>
    )
}

export default FilterButtons;