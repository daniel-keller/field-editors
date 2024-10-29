import * as React from 'react';

import { Form, TextInput } from '@contentful/f36-components';
import { css } from 'emotion';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { findNodePath, RenderElementProps, setNodes, Element } from '../../../internal';

const quote = css({
  margin: '0 0 1.3125rem',
  border: '1px solid darkgray',
  padding: '10px',
  borderRadius: '5px',
  fontStyle: 'normal',
});

const attr = css({
  marginBottom: '10px',
});

const right = css({
  textAlign: 'right',
});

type QuoteElementProps = {
  element: Element & {
    data: {
      attribution?: string;
    };
  };
  attributes: Pick<RenderElementProps, 'attributes'>;
  children: React.ReactNode;
};


export function Quote(props: QuoteElementProps) {
  const { element, attributes, children } = props;
  const editor = useContentfulEditor();

  const [attribution, setAttribution] = React.useState<string | undefined>(element.data.attribution);

  const changeAttribution = React.useCallback((e) => {
    if (!editor) return;
    setAttribution(e.target.value);
    const path = findNodePath(editor, element);
    const att = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    setNodes(editor, {data: {...element.data, attribution: att}}, {at: path});
  }, [editor, element]);

  return (
    <blockquote {...attributes} className={quote}>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 44 39" fill="none">
          <path d="M18.24 0.119995L12.12 19.56H19.44V38.88H0V19.56L10.2 0.119995H18.24ZM36.6 19.56H43.92V38.88H24.48V19.56L34.68 0.119995H42.72L36.6 19.56Z" fill="#000" fillOpacity="0.5"/>
        </svg>
      </div>

      {children}
      <Form className={attr} contentEditable={false}>
        <TextInput
          name='attribution'
          placeholder='Attribution'
          value={attribution}
          onChange={changeAttribution}
        />
      </Form>

      <div className={right}>
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="20" viewBox="0 0 44 39" fill="none">
          <path d="M25.76 39L31.88 19.56L24.56 19.56V0.239998H44L44 19.56L33.8 39H25.76ZM7.4 19.56L0.079998 19.56L0.079998 0.239998L19.52 0.239998V19.56L9.32 39H1.28L7.4 19.56Z" fill="#000" fillOpacity="0.5"/>
        </svg>
      </div>
    </blockquote>
  );
}
