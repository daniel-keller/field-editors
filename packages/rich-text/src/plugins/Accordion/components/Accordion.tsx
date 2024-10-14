import * as React from 'react';

import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { useSelected } from 'slate-react';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { isSelectionAtBlockStart, RenderElementProps } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';

export default function Accordion(props: RenderElementProps) {
  const editor = useContentfulEditor();
  const startOfAnySelected = isSelectionAtBlockStart(editor, {
    match: (n) => n.type == BLOCKS.ACCORDION
  });
  const thisStartSelected = useSelected() && startOfAnySelected;

  const accordion = css({
    margin: '0 0 1.3125rem',
    border: `1px solid ${thisStartSelected ? tokens.blue600 : 'darkgray'}`,
    backgroundColor: `${thisStartSelected ? tokens.blue100 : 'initial'}`,
    padding: '10px',
    borderRadius: '5px',
    fontStyle: 'normal',
  });

  return (
    <div {...props.attributes} className={accordion}>
      {props.children}
    </div>
  );
}
