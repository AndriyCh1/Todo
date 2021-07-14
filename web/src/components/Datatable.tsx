import MUIDataTable from "mui-datatables";

function Datatable(props:any){
    const columns = [
        'Опис',
        {
          name: '',
          label: '',
          options: {
            setCellProps: () => ({
              align: 'right',
            }),
          },
        },
      ];
    
    const options = {
        download: false,
        filter: false,
        print: false,
        viewColumns: false,
        tableBodyHeight: '60vh',
        selectableRowsHideCheckboxes: true,
        selectableRowsOnClick: false,
      }
    
    return(
        <MUIDataTable
        title={"Список завдань"}
        data={ props.data}
        columns={columns}
        options= {options}
        />
    )
};
export default Datatable;