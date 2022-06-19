import React, { useState, useEffect } from "react";
import
{
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Box,
    Typography,
    Container,
    FormHelperText,
    Autocomplete
} from "@mui/material";
import { Article, Clear } from "@mui/icons-material";
import TransitionAlerts from './TransitionAlerts'
import useFormError from "./hooks/useFormError";
import { handleDeclrData } from "../utilsCS/_basic";
import { getTags } from '../utilsCS/_get'
import TextArea from "./TextArea";
import useStyles from "../assets/styles/_CreateForm";
import UploadBtnPdf from "./UploadBtnPdf";
import BackLink from "./BackLink";
import useLoading from './hooks/useLoading'
import handleAsync from './custom/handleAsync'
import Redirects_CS from '../utilsCS/CS_Redirects'
import useLocalStorage from "./hooks/useLocalStorage"

const CreateForm = (props) => handleAsync(props, (props) =>
{
    const [TitleError, , helperTitleText, , checkTitleKey, setTitleTrue, setTitleFalse, titleValid,] = useFormError(false);
    const [DescError, , helperDescText, , checkDescKey, setDescTrue, setDescFalse, descValid,] = useFormError(false);

    const [editorState, setEditorState, resetEditorState] = useLocalStorage("description")
    const [file, changeFile] = useState();
    const [fullTags, setFullTags] = useState([]);
    const [tags, setTags] = useState([]);

    const [loadingWhile, loadingSwitch] = useLoading(false)

    const { alert, setAlert, setAlertMsg, setError, Mounted } = props;
    const classes = useStyles()


    useEffect(async () =>
    {
        const newTags = await getTags()
        Redirects_CS.handleRes(newTags, typeof window !== "undefined" && window, setError)
        if (Mounted) setFullTags(newTags.obj)
    }, [Mounted])


    const handleSubmit = async (body) =>
    {
        loadingWhile(async () =>
        {
            await fetch(process.env.NEXT_PUBLIC_DR_HOST, {
                method: 'POST',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) setAlertMsg(res.error.message, "error")
                    Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                    resetEditorState()
                })
        })
    };

    const errCheck = async (e) =>
    {
        e.preventDefault();

        const { data, title, description } = handleDeclrData(e.currentTarget, file, editorState)

        const newTags = []
        tags.forEach((t) => newTags.push(t._id))

        data.append("tags", JSON.stringify(newTags))

        if (titleValid(title) && descValid(description))
        {
            setTitleTrue();
            setDescTrue();
            handleSubmit(data);
        }
        else
        {
            if (!titleValid(title))
            {
                setTitleFalse();
            }
            if (!descValid(description))
            {
                setDescFalse();
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box className={classes.Container}>
                <Avatar sx={{ m: 1, bgcolor: "primary" }}>
                    <Article />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Create Declaration
                </Typography>
                {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
                <Box
                    component="form"
                    enctype="multipart/form-data"
                    onSubmit={errCheck}
                    noValidate
                    className={classes.Form}
                >
                    <TextField
                        margin="normal"
                        inputProps={{ maxLength: 20 }}
                        required
                        error={TitleError}
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoComplete="title"
                        onKeyPress={checkTitleKey}
                        autoFocus
                    />
                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={TitleError}>{helperTitleText}</FormHelperText>)
                    }

                    <TextArea
                        styles={classes.Editor}
                        placeholder="Description"
                        setData={setEditorState}
                        error={DescError}
                        checkDescKey={checkDescKey}
                        data={editorState}
                    />

                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={DescError}>{helperDescText}</FormHelperText>)
                    }

                    <UploadBtnPdf changeFile={changeFile} file={file} />

                    <Autocomplete
                        sx={{ mt: 2 }}
                        multiple
                        id="tags-outlined"
                        options={fullTags}
                        getOptionLabel={(tag) => tag.content}
                        // defaultValue={[top100Films[13]]}
                        filterSelectedOptions
                        onChange={(event, value) => setTags(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tags"
                                placeholder="Select tags"
                            />
                        )}
                    />

                    {loadingSwitch(0, () =>
                    (<>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Create
                        </Button>
                        <BackLink>Back</BackLink>
                    </>))}
                </Box>
            </Box>
        </Container>
    );
})

export default CreateForm