import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, resetKeyGenerator, convertToRaw, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Box, Button } from '@mui/material';

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
        console.log(this.props.data)
        if (this.state.render === 1)
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
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
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

class StyleButton extends React.Component
{
    constructor()
    {
        super();
        this.onToggle = (e) =>
        {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render()
    {
        let className = 'RichEditor-styleButton';
        if (this.props.active)
        {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) =>
{
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) =>
{
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};
export default TextArea;