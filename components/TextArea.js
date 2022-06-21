import React, { useState } from 'react';
import { AtomicBlockUtils, EditorState, RichUtils, resetKeyGenerator, convertToRaw, convertFromRaw, getDefaultKeyBinding, Entity } from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import createImagePlugin from '@draft-js-plugins/image';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import { Box, Button, TextField, IconButton, Typography, Paper, } from '@mui/material';
import { FormatQuote, FormatListBulleted, FormatListNumbered, Code, FormatBold, FormatItalic, FormatUnderlined, HighlightAlt, Attachment, Image, AddLink } from "@mui/icons-material"
import { withStyles } from "@mui/styles"
import { rgbToHex } from "../utilsCS/_basic"
import mockUpload from "./mockUpload"

import createLinkPlugin from "@draft-js-plugins/anchor";
import "@draft-js-plugins/anchor/lib/plugin.css";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import '@draft-js-plugins/static-toolbar/lib/plugin.css';

const linkPlugin = createLinkPlugin();


const styles = theme => ({
    TextAreaError: {
        width: "100%",
        border: "1px solid",
        borderColor: "red!important",
        "&:hover":
        {
            borderColor: "white"
        }
    },
    TextAreaNormal: {
        width: "100%",
        border: "1px solid",
        borderColor: theme.line,
        "&:hover":
        {
            borderColor: theme.palette.text.default,
        }
    }

})


const imagePlugin = createImagePlugin();

const toolbarPlugin = createToolbarPlugin({
    structure: [linkPlugin.LinkButton]
});

const { Toolbar } = toolbarPlugin;

const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: mockUpload,
    addImage: imagePlugin.addImage,
});


class TextArea extends React.Component
{
    static defaultProps = {
        data: {
            blocks: [
                {
                    key: '2q0qn',
                    text: '',
                    type: 'unstyled',
                    depth: 0,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {}
                },
            ],
            entityMap: {}
        }
    }

    constructor(props)
    {
        super(props);
        this.state =
        {
            editorState: props.data
                ? EditorState.createWithContent(convertFromRaw(props.data))
                : EditorState.createEmpty(),
            render: 0
        };
        // this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) =>
        {
            this.setState({ editorState });
            const editorContent = convertToRaw(editorState.getCurrentContent())
            props.setData(editorContent);
        }
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        this.insertImage = (editorState, base64) => this._insertImage(editorState, base64)
    }

    componentDidMount()
    {
        this.setState({ render: 1 })
        const editorContent = convertToRaw(this.state.editorState.getCurrentContent())
        this.props.setData(editorContent);
    }

    componentDidUpdate()
    {
        if (this.state.render === 1 && this.props.data)
        {
            this.setState({ editorState: EditorState.createWithContent(convertFromRaw(this.props.data)) })
            this.setState((prevState) => ({
                render: prevState.render + 1
            }))
        }
    }

    _handleKeyCommand(command)
    {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState)
        {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _toggleBlockType(blockType)
    {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle)
    {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    _insertImage = (editorState, base64) =>
    {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            'image',
            'IMMUTABLE',
            { src: base64 },
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = EditorState.set(
            editorState,
            { currentContent: contentStateWithEntity },
        );
        return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
    };

    mockUpload = (data, success, failed, progress) =>
    {
        readFile(data.files[0]).then(res => 
        {
            success([res], { retainSrc: true })
        })

    }



    render()
    {
        const { editorState } = this.state;
        const { classes, theme, noImgs } = this.props


        const focusPlugin = createFocusPlugin();
        const blockDndPlugin = createBlockDndPlugin();
        const resizeablePlugin = createResizeablePlugin();
        const linkifyPlugin = createLinkifyPlugin();

        const plugins = [
            dragNDropFileUploadPlugin,
            blockDndPlugin,
            focusPlugin,
            resizeablePlugin,
            imagePlugin,
            linkifyPlugin,
            linkPlugin,
            toolbarPlugin
        ];
        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText())
        {
            if (contentState.getBlockMap().first().getType() !== 'unstyled')
            {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        const onHoverEnter = () =>
        {
            if (rgbToHex(this.refs.textarea.style.borderColor) !== this.props.theme.palette.primary.main.toLowerCase())
            {
                this.refs.textarea.style.borderColor = "black"
                this.refs.textarea.style.outline = `none`
            }
        }

        const onHoverLeave = () =>
        {
            if (rgbToHex(this.refs.textarea.style.borderColor) !== this.props.theme.palette.primary.main.toLowerCase())
            {
                this.refs.textarea.style.borderColor = "gray"
                this.refs.textarea.style.outline = `none`
            }
        }

        const onFocus = () =>
        {
            this.refs.editor.focus()
            this.refs.textarea.style.border = `1px solid ${theme.palette.primary.main}`
            this.refs.textarea.style.outline = `1px solid ${theme.palette.primary.main}`
        }

        const onBlur = () =>
        {
            this.refs.textarea.style.border = "1px solid gray"
            this.refs.textarea.style.outline = `none`
        }

        const setEditor = (img) =>
        {
            const newEditorState = this.insertImage(this.state.editorState, img//state Url(images)
            );
            this.setState({ editorState: newEditorState });
        }


        return (
            <Box
                className={`RichEditor-root ${this.props.error ? classes.TextAreaError : classes.TextAreaNormal}`}
                ref="textarea"
                onMouseEnter={onHoverEnter}
                onMouseLeave={onHoverLeave}
            >
                <InlineStyleControls
                    noImgs={noImgs}
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                    setEditor={setEditor}
                // linkPlugin={linkPlugin}
                />
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />

                <Box className={className} onClick={onFocus}>
                    <Editor
                        editorKey="editor"
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        onChange={this.onChange}
                        placeholder={this.props.placeholder}
                        ref="editor"
                        spellCheck={true}
                        keyBindingFn={(e) => { this.props.checkDescKey(e, false); return getDefaultKeyBinding(e); }}
                        plugins={plugins}
                        onBlur={onBlur}
                    /> <Toolbar>
                        {// may be use React.Fragment instead of div to improve perfomance after React 16
                            externalProps => (
                                <div>
                                    <linkPlugin.LinkButton {...externalProps} />
                                </div>
                            )}
                    </Toolbar>
                </Box>
            </Box >
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block)
{
    switch (block.getType())
    {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

const StyleButton = (props) =>
{
    const { style, label, active } = props

    const onToggle = (e) =>
    {
        e.preventDefault();
        props.onToggle(style);
    };

    let className = 'RichEditor-styleButton';
    if (active)
    {
        className += ' RichEditor-activeButton';
    }

    return (
        <span className={className} onMouseDown={onToggle}>
            {label}
        </span>
    );
}

const StyleNum = (props) =>
{
    const [num, setNum] = useState(6)

    const types = [
        { label: 'H1', style: 'header-one' },
        { label: 'H2', style: 'header-two' },
        { label: 'H3', style: 'header-three' },
        { label: 'H4', style: 'header-four' },
        { label: 'H5', style: 'header-five' },
        { label: 'H6', style: 'header-six' }]

    const increase = (e) =>
    {
        e.preventDefault();
        if (num < 6)
        {
            if (num === 5)
            {
                props.onToggle(types[5].style)
                console.log("none")
                setNum(num + 1)
            }
            else
            {
                setNum(num + 1)
                console.log(num + 1)
                props.onToggle(types[num + 1].style)
            }
        }
    };

    const descrease = (e) =>
    {
        e.preventDefault();
        if (num > 1)
        {
            setNum(num - 1)
            console.log(num - 1)
            props.onToggle(types[num - 1].style);
        }
    };

    return (
        <span className='RichEditor-styleButton'>
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: 0.5, marginLeft: "8px", marginRight: "6px" }}>
                {/* <Typography color="text.secondary">{num === 6 ? "n" : num}</Typography> */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <div onClick={increase} style={{
                        width: 10, height: 10,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderBottom: "5px solid gray",
                    }}></div>
                    <div onClick={descrease} style={{
                        width: 10, height: 10,
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid gray",
                    }}></div>
                </Box>
            </Box>
        </span>
    );
}

const BlockStyleControls = (props) =>
{
    const { editorState } = props;

    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div style={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
            <StyleNum onToggle={props.onToggle} />
            <StyleButton
                key={'blockquote'}
                active={'blockquote' === blockType}
                label={(<FormatQuote />)}
                onToggle={props.onToggle}
                style={'blockquote'}
            />
            <StyleButton
                key={'unordered-list-item'}
                active={'unordered-list-item' === blockType}
                label={(<FormatListBulleted />)}
                onToggle={props.onToggle}
                style={'unordered-list-item'}
            />
            <StyleButton
                key={'ordered-list-item'}
                active={'ordered-list-item' === blockType}
                label={(<FormatListNumbered />)}
                onToggle={props.onToggle}
                style={'ordered-list-item'}
            />
            <StyleButton
                key={'code-block'}
                active={'code-block' === blockType}
                label={(<Code />)}
                onToggle={props.onToggle}
                style={'code-block'}
            />
        </div>
    );
};

const InlineStyleControls = (props) =>
{
    const { noImgs } = props
    var currentStyle = props.editorState.getCurrentInlineStyle();
    const [open, setOpen] = React.useState(false)
    const [url, setUrl] = React.useState("")
    const fileRef = React.useRef()

    return (
        <div style={{ display: "flex", justifyContent: "left", alignItems: "center" }}>
            <StyleButton
                key={'BOLD'}
                active={currentStyle.has('BOLD')}
                label={(<FormatBold />)}
                onToggle={props.onToggle}
                style={'BOLD'}
            />
            <StyleButton
                key={'ITALIC'}
                active={currentStyle.has('ITALIC')}
                label={(<FormatItalic />)}
                onToggle={props.onToggle}
                style={'ITALIC'}
            />
            <StyleButton
                key={'UNDERLINE'}
                active={currentStyle.has('UNDERLINE')}
                label={(<FormatUnderlined />)}
                onToggle={props.onToggle}
                style={'UNDERLINE'}
            />
            <StyleButton
                key={'CODE'}
                active={currentStyle.has('CODE')}
                label={(<HighlightAlt />)}
                onToggle={props.onToggle}
                style={'CODE'}
            />
            {/* <StyleButton
                key={'LINK'}
                active={currentStyle.has('LINK')}
                label={(<AddLink />)}
                onToggle={props.onToggle}
                style={'LINK'}
            /> */}
            {/* <linkPlugin.LinkButton />
            <Image sx={{
                mb: 1, color: "gray", "&:hover": {
                    cursor: "pointer"
                }
            }}
                onClick={() => fileRef.current.click()}
            /> */}
            {!noImgs &&
                (<>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        hidden
                        ref={fileRef}
                        onChange={(e) => props.setEditor(URL.createObjectURL(e.target.files[0]))}
                        accept="image/png, image/jpg, image/jpeg"
                    />
                    <Attachment
                        sx={{
                            mb: 1, ml: 2, color: "gray", "&:hover": {
                                cursor: "pointer"
                            }
                        }}
                        onClick={() => setOpen(!open)}
                    />
                    {open && (<Paper sx={{ width: 100, height: 30, position: "absolute", ml: 25, mb: 7, display: 'flex', justifyContent: "center" }}>
                        <TextField value={url} onChange={(e) => setUrl(e.target.value)} variant="outlined" sx={{ width: "80%", height: "90%", "& input": { padding: "3px" } }} />
                        <IconButton type="submit" onClick={(e) => 
                        {
                            props.setEditor(url)
                            setUrl('')
                            setOpen(false)
                        }}>+</IconButton>
                    </Paper>)}
                </>)}
        </div >
    );
};

export default withStyles(styles, { withTheme: true })(TextArea)