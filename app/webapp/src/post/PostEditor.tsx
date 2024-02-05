import { ProseMirror } from '@nytimes/react-prosemirror';
import { Box, Text } from 'grommet';
import { Schema } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useThemeContext } from '../ui-components/ThemedApp';
import './posteditor.css';

export interface IStatementEditable {
  placeholder?: string;
  editable?: boolean;
  value?: string;
  onChanged?: (value?: string) => void;
  onClick?: (e: React.MouseEvent) => void;
  containerStyle?: React.CSSProperties;
}

const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },
    text: {
      group: 'inline',
    },
    paragraph: {
      group: 'block',
      content: 'inline*',
      toDOM() {
        return ['p', 0];
      },
      parseDOM: [{ tag: 'p' }],
    },
  },
  marks: {
    // While we want to keep the schema to plain text, you might consider using
    // a plugin for URL detection and styling instead of a schema mark for links.
  },
});

function editorStateToPlainText(state: any) {
  const content: any = [];
  state.doc.forEach((blockNode: any) => {
    if (blockNode.type.name === 'paragraph') {
      content.push(blockNode.textContent + '\n\n');
    }
  });
  return content.join('');
}

const defaultState = EditorState.create({ schema });

export const PostEditor = (props: IStatementEditable) => {
  const { t } = useTranslation();
  const { constants } = useThemeContext();
  const [text, setText] = useState<string>();

  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [editorState, setEditorState] = useState(
    EditorState.create({ schema })
  );

  const editable = props.editable !== undefined && props.editable;

  const handleTransaction = (tr: any) => {
    setEditorState((s) => s.apply(tr));
  };

  useEffect(() => {
    const text = editorStateToPlainText(editorState);
    if (props.onChanged) {
      props.onChanged(text);
    }
  }, [editorState]);

  useEffect(() => {}, [text, props.onChanged]);

  useEffect(() => {
    setText(props.value);
  }, [props.value]);

  return (
    <>
      <Box
        style={{
          backgroundColor: constants.colors.primary,
          color: constants.colors.textOnPrimary,
          fontSize: '36px',
          borderRadius: '6px',
          cursor: props.onClick ? 'pointer' : '',
          ...props.containerStyle,
        }}
        pad="small"
        onClick={props.onClick}>
        <Box>
          <ProseMirror
            mount={mount}
            defaultState={defaultState}
            state={editorState}
            dispatchTransaction={handleTransaction}>
            <div ref={setMount} />
          </ProseMirror>
        </Box>
      </Box>
      {editable ? (
        <Box pad="small">
          <Text
            size="small"
            style={{
              textAlign: 'center',
              color: constants.colors.primaryLight,
            }}>
            {t('helpEditable')}
          </Text>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
};
