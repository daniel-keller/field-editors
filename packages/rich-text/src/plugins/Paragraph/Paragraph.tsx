import * as React from 'react';

import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { RenderElementProps } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';
import { AlignValuesType } from '../Align';

interface RenderAlignableElementProps extends RenderElementProps {
  element: RenderElementProps['element'] & { data?: { align: AlignValuesType } };
}

export function Paragraph(props: RenderAlignableElementProps) {
  const styles = {
    [BLOCKS.PARAGRAPH]: css`
      line-height: ${tokens.lineHeightDefault};
      margin-bottom: 1.5em;
      direction: inherit;
      text-align: ${props.element.data?.align ?? 'initial'};
      &:only-child {
        margin-bottom: 0;
      }
    `,
  };

  return (
    <div {...props.attributes} className={styles[BLOCKS.PARAGRAPH]}>
      {props.children}
    </div>
  );
}
