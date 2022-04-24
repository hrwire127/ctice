import * as React from 'react';
import { Stack, TextField, IconButton, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { getSpecificDate } from "../utilsCS/_client"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import useStyles from '../assets/styles/_DatePicker';

function DatePicker(props)
{
    const [value, setValue] = React.useState("Invalid");
    const { setTime } = props;
    const classes = useStyles();

    const handleChange = (newValue) =>
    {
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
        <Box className={classes.Container}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3} className={classes.Date}>
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
            </LocalizationProvider>
            <Box>
                <IconButton onClick={handleChange.bind(null, "Invalid")}><HighlightOffIcon /></IconButton>
            </Box>
        </Box>
    );
}

export default DatePicker;