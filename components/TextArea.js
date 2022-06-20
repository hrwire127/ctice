import React, { useState } from 'react';
import { AtomicBlockUtils, EditorState, RichUtils, resetKeyGenerator, convertToRaw, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css'
import '@draft-js-plugins/image/lib/plugin.css';
import { Box, Button, TextField, IconButton, Typography } from '@mui/material';
import { FormatQuote, FormatListBulleted, FormatListNumbered, Code, FormatBold, FormatItalic, FormatUnderlined, HighlightAlt, ArrowDropUp, ArrowDropDown } from "@mui/icons-material"

import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';
import mockUpload from './mockUpload';


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
                ? EditorState.createWithContent(convertFromRaw({
                    entityMap: {
                        0: {
                            type: 'IMAGE',
                            mutability: 'IMMUTABLE',
                            data: {
                                src: 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
                            },
                        },
                    },
                    blocks: [
                        {
                            key: '9gm3s',
                            text:
                                'You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.',
                            type: 'unstyled',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        },
                        {
                            key: 'ov7r',
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [
                                {
                                    offset: 0,
                                    length: 1,
                                    key: 0,
                                },
                            ],
                            data: {},
                        },
                        {
                            key: 'e23a8',
                            text: 'See advanced examples further down …',
                            type: 'unstyled',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        },
                    ],
                }))
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

    render()
    {
        const { editorState } = this.state;

        const focusPlugin = createFocusPlugin();
        const resizeablePlugin = createResizeablePlugin();
        const blockDndPlugin = createBlockDndPlugin();
        const alignmentPlugin = createAlignmentPlugin();
        const { AlignmentTool } = alignmentPlugin;

        const decorator = composeDecorators(
            resizeablePlugin.decorator,
            alignmentPlugin.decorator,
            focusPlugin.decorator,
            blockDndPlugin.decorator
        );
        const imagePlugin = createImagePlugin({ decorator });

        const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
            handleUpload: mockUpload,
            addImage: imagePlugin.addImage,
        });

        const plugins = [
            dragNDropFileUploadPlugin,
            blockDndPlugin,
            focusPlugin,
            alignmentPlugin,
            resizeablePlugin,
            imagePlugin,
        ];

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText())
        {
            if (contentState.getBlockMap().first().getType() !== 'unstyled')
            {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        console.log(this.props.data)

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
                <div style={{ display: 'flex', justifyContent: "left" }}>
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={(e) => 
                        {
                            const newEditorState = this.insertImage(this.state.editorState, URL.createObjectURL(e.target.files[0])//state Url(images)
                            );
                            this.setState({ editorState: newEditorState });
                        }}
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
                        plugins={plugins}
                    />
                    <AlignmentTool />
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