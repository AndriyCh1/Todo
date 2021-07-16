import MUIDataTable from "mui-datatables";
import { mutate } from "swr";


interface IDatatableProps{
  data: [string, JSX.Element][];
}

function Datatable({data}: IDatatableProps){ 

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
        data={data}
        columns={columns}
        options= {options}
        />
    )
};
export default Datatable;