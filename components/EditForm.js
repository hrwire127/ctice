import React, { useState, useContext } from 'react';
import
{
    Avatar, Button, CssBaseline,
    Autocomplete, TextField, Box,
    Typography, Container, FormHelperText, IconButton
} from '@mui/material';
import TransitionAlerts from './TransitionAlerts'
import { Article, Clear } from '@mui/icons-material';
import { handleDeclrData } from "../utilsCS/_basic";
import useFormError from './hooks/useFormError';
import useStyles from "../assets/styles/_EditForm"
import TextArea from './TextArea'
import UploadBtnPdf from "./UploadBtnPdf";
import BackLink from "./BackLink";
import useAlertMsg from './hooks/useAlertMsg'
import useLoading from './hooks/useLoading'
import Redirects_CS from '../utilsCS/CS_Redirects'


function EditForm(props)
{
    const [TitleError, , helperTitleText, , checkTitleKey, setTitleTrue, setTitleFalse, titleValid] = useFormError(false)
    const [DescError, , helperDescText, , checkDescKey, setDescTrue, setDescFalse, descValid] = useFormError(false)
    const [TagError, , helperTagText, , checkTagKey, setTagTrue, setTagFalse, tagValid,] = useFormError(false);

    const { declaration, fullTags, setError } = props;
    const { title, description, _id: id, tags: oldTags } = declaration;

    const filteredTags = fullTags.filter(t => oldTags.some(nt => nt._id === t._id))

    const [editorState, setEditorState] = useState(JSON.parse(description));
    const [file, changeFile] = useState(declaration.file);
    const [tags, setTags] = useState(filteredTags);

    const [setAlertMsg, alert, setAlert] = useAlertMsg()
    const [submitWhile, submitLoading] = useLoading(false)

    const classes = useStyles();


    const handleSubmit = async (body) =>
    {
        submitWhile(async () =>
        {
            await fetch(`${process.env.NEXT_PUBLIC_DR_HOST}/view/${id}`, {
                method: 'PUT',
                body: body,
            }).then(response => response.json())
                .then(async res =>
                {
                    if (res.error) setAlertMsg(res.error.message, "error")
                    else Redirects_CS.handleRes(res, typeof window !== "undefined" && window, setError)
                })
        })
    };

    const errCheck = async (e) =>
    {
        e.preventDefault();

        const { data, title, description } = await handleDeclrData(e.currentTarget, file, editorState)

        const newTags = []
        tags.forEach((t) => newTags.push(t._id))

        data.append("tags", JSON.stringify(newTags))

        if (titleValid(title) && descValid(description) && tagValid(tags[0])) //add editor state
        {
            setTitleTrue()
            setDescTrue()
            setTagTrue();
            handleSubmit(data)
        }
        else
        {

            if (!titleValid(title)) { setTitleFalse() }
            if (!descValid(description)) { setDescFalse() }
            if (!tagValid(tags[0]))
            {
                setTagFalse();
            }
        }
    }
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box className={classes.Container}>
                <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
                    <Article />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Edit {title}
                </Typography>
                {alert && (<TransitionAlerts type={alert.type} setFlash={setAlert}>{alert.message}</TransitionAlerts>)}
                <Box
                    component="form"
                    error={TitleError}
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
                        defaultValue={title}
                    />

                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={TitleError}>{helperTitleText}</FormHelperText>)
                    }

                    <TextArea
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
                        defaultValue={filteredTags}
                        filterSelectedOptions
                        onChange={(event, value) => setTags(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                error={TagError}
                                onKeyPress={checkTagKey}
                                label="Tags"
                                placeholder="Select tags"
                            />
                        )}
                    />
                    
                    {alert
                        ? (<FormHelperText error={true}>{"Something Went Wrong"}</FormHelperText>)
                        : (<FormHelperText error={TagError}>{helperTagText}</FormHelperText>)
                    }

                    {submitLoading(0, () => (
                        <>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Finish
                            </Button>
                            <BackLink>Back</BackLink>
                        </>
                    ))}

                </Box>
            </Box>
        </Container>
    );
}

export default EditForm;
