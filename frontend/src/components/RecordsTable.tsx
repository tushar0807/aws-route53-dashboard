
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import {
  DEFAULT_OPTIONS,
  getTheme,
} from '@table-library/react-table-library/mantine';


interface TableDataRow {
  id: number;
  name: string;
  age: number;
  city: string;
}

const RecordsTable = () => {
    const COLUMNS = [
        { label: 'ID', renderCell: (item : TableDataRow) => item.id, resize: true },
        {
          label: 'Name',
          renderCell: (item : TableDataRow) => item.name,
          resize: true,
        },
        { label: 'Age', renderCell: (item : TableDataRow) => item.age, resize: true },
        {
          label: 'City',
          renderCell: (item : TableDataRow) => item.city,
          resize: true,
        },
      ];

      const tableData = [
        { id: 1, name: 'John', age: 30, city: 'New York' },
        { id: 2, name: 'Alice', age: 25, city: 'Los Angeles' },
        { id: 3, name: 'Bob', age: 35, city: 'Chicago' },
        { id: 4, name: 'Emily', age: 28, city: 'San Francisco' },
        { id: 5, name: 'Michael', age: 40, city: 'Boston' },
    ];

    const mantineTheme = getTheme(DEFAULT_OPTIONS);
    const customTheme = {
      HeaderRow: `
        background-color: #eaf5fd;
      `,
      

    };
    

    const theme = useTheme([mantineTheme, customTheme]); 
    
    return (
        <>
          <CompactTable columns={COLUMNS} data={{nodes : tableData}} theme={theme} />
        </>
      );
    
}

export default RecordsTable;
