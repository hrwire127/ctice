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
    const [value, setValue] = React.useState("Invalid");
    const { setTime } = props;

    const handleChange = (newValue) =>
    {
        console.log(newValue)
        setValue(newValue);
        if (newValue === "Invalid" || !newValue)
        {
            setTime("Invalid")
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
                    label="Date Filter"
                    inputFormat="MM/dd/yyyy"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => 
                    {
                        if (value === "Invalid") 
                        {
                            params.inputProps.value = "none";
                            params.error = false;
                        }
                        return <TextField {...params} />
                    }}
                />
            </Stack>
            <button onClick={handleChange.bind(null, "Invalid")}>x</button>
        </LocalizationProvider>
    );
}

export default DatePicker;