import React from 'react'
import { Paper } from '@mui/material'
import { Check } from '@mui/icons-material'

function SelectionCard(props)
{
    const { checked, image, setImage } = props

    return checked
        ? (<Paper
            sx={{
                width: 100,
                height: 100,
                position: "relative",
                "& div": {
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(to top, rgb(0 0 0 / 54%), rgb(0 0 0 / 54%)), url(${image}) no-repeat center`,
                    backgroundSize: "cover",
                    borderRadius: 1,
                    borderColor: "primary.main",
                    boxShadow: "0px 0px 5px 0px",
                },
            }}>
            <div
                alt="Picture"
            />
            <Check
                color="primary"
                sx={{
                    fontSize: 90,
                    position: "absolute",
                    top: "0%",
                    left: "6%"
                }}
            />
        </Paper>)
        : (<Paper
            onClick={() => setImage(image)}
            sx={{
                width: 100,
                height: 100,
                "&:hover": {
                    cursor: "pointer",
                    "& div": {
                        background: `linear-gradient(rgb(0 0 0 / 71%), rgb(0 0 0 / 71%)), url(${image}) no-repeat center`,
                        backgroundSize: "cover",
                    }
                },
                "& div": {
                    width: "100%",
                    height: "100%",
                    background: `url(${image}) no-repeat center`,
                    backgroundSize: "cover",
                    borderRadius: 1,
                    borderColor: "primary.main",
                    boxShadow: "0px 0px 5px 0px",
                },
            }}>
            <div
                alt="Picture"
            />
        </Paper>)
}

export default SelectionCard