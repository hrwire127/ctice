import React, {memo} from 'react';
import { Stack, TextField, IconButton, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Clear } from '@mui/icons-material';
import useStyles from '../assets/styles/_DatePicker';

function DatePicker(props)
{
    const { setTime, value } = props;

    const maxDate = new Date();
    const minDate = new Date('2020-01-01');
    const classes = useStyles();

    // console.log("Date picker")

    const handleChange = (newValue) =>
    {
        if (newValue === "Invalid" || !newValue)
        {
            setTime("Invalid")
        }
        else
        {
            if (new Date().toDateString() === newValue.toDateString())
            {
                setTime("Invalid")
                return;
            }
            else 
            {
                setTime(newValue)
            }
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
                        maxDate={maxDate}
                        minDate={minDate}
                        InputProps={{
                            endAdornment: (
                                <IconButton className={classes.Btn} onClick={handleChange.bind(null, "Invalid")}>
                                    <Clear />
                                </IconButton>
                            )
                        }}
                        InputAdornmentProps={{
                            position: "start"
                        }}
                        renderInput={(params) => 
                        {
                            if (value === "Invalid") 
                            {
                                params.inputProps.value = "";
                                params.error = false;
                            }
                            return <TextField
                                variant="standard"
                                size="small"
                                className={classes.TextField}
                                {...params}
                            />
                        }}
                    />
                </Stack>
            </LocalizationProvider>
            {/* <Box>
                <IconButton className={classes.Btn} onClick={handleChange.bind(null, "Invalid")}><HighlightOffIcon /></IconButton>
            </Box> */}
        </Box>
    );
}

export default memo(DatePicker);