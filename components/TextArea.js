import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, resetKeyGenerator, convertToRaw, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Box, Button, TextField, IconButton, Typography } from '@mui/material';
import { FormatQuote, FormatListBulleted, FormatListNumbered, Code, FormatBold, FormatItalic, FormatUnderlined, HighlightAlt, ArrowDropUp, ArrowDropDown } from "@mui/icons-material"


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
        console.log(props.data)
        this.state =
        {
            editorState: props.data
                ? EditorState.createWithContent(convertFromRaw(props.data))
                : EditorState.createEmpty(),
            render: 0
        };
        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) =>
        {
            this.setState({ editorState });
            const editorContent = convertToRaw(editorState.getCurrentContent())
            props.setData(editorContent);
        }
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    componentDidMount()
    {
        this.setState({ render: 1 })
        const editorContent = convertToRaw(this.state.editorState.getCurrentContent())
        this.props.setData(editorContent);
    }

    componentDidUpdate()
    {
        // console.log(this.props.data)
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

    render()
    {
        const { editorState } = this.state;

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

        return (
            <Box className="RichEditor-root"//theme => theme.spacing(2)
                sx={
                    this.props.error
                        ? {
                            width: "100%",
                            border: "1px solid",
                            borderColor: "red!important",
                            "&:hover":
                            {
                                borderColor: "white"
                            }
                        }
                        : {
                            width: "100%",
                            border: "1px solid",
                            borderColor: theme => theme.line,
                            "&:hover":
                            {
                                borderColor: theme => theme.palette.text.default,
                            }
                        }
                }
            >
                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                </div>
                <div className={className} onClick={this.focus}>
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
                    />
                </div>
            </Box>
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
            <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: 0.5 }}>
                <Typography color="text.secondary">{num === 6 ? "n" : num}</Typography>
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
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        </div>
    );
};

export default TextArea;