import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { getSpecificDate } from "../utilsCS/_client"


function DatePicker(props)
{
    const [value, setValue] = React.useState(new Date(''));
    const { setTime } = props;

    const handleChange = (newValue) =>
    {
        const empty = new Date('');
        console.log(newValue)
        console.log(newValue === empty)
        setValue(newValue);
        if(new String(newValue).valueOf() == new String("Invalid Date").valueOf())
        {
            setTime("a")
        }
        else
        {
            setTime(getSpecificDate(newValue))
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3} sx={{ width: 200 }}>
                <DesktopDatePicker
                    label="Date desktop"
                    inputFormat="MM/dd/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Stack>
            <button onClick={handleChange.bind(null, new Date(''))}>x</button>
        </LocalizationProvider>
    );
}

export default DatePicker;