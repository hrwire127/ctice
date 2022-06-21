import React, { useState } from 'react';
import { AtomicBlockUtils, EditorState, RichUtils, resetKeyGenerator, convertToRaw, convertFromRaw, getDefaultKeyBinding } from 'draft-js';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import 'draft-js/dist/Draft.css';
import createImagePlugin from '@draft-js-plugins/image';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createDragNDropUploadPlugin from '@draft-js-plugins/drag-n-drop-upload';
import mockUpload from "./mockUpload"

class EditorView extends React.Component
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
    }

    render()
    {
        const { editorState } = this.state;

        const focusPlugin = createFocusPlugin();
        const blockDndPlugin = createBlockDndPlugin();
        const resizeablePlugin = createResizeablePlugin();

        const imagePlugin = createImagePlugin();

        const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
            handleUpload: mockUpload,
            addImage: imagePlugin.addImage,
        });

        const plugins = [
            dragNDropFileUploadPlugin,
            blockDndPlugin,
            focusPlugin,
            resizeablePlugin,
            imagePlugin,
        ];

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
            <Editor
                editorKey="editor"
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                editorState={editorState}
                ref="editor"
                plugins={plugins}
                readOnly={true}
                onChange={() => null}
            />
        );
    }
}

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

export default EditorView