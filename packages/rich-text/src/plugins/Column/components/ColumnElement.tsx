import React from 'react';

import tokens from '@contentful/f36-tokens';
import { PlateElement, useElement, withHOC } from '@udecode/plate-common';
import type { TColumnElement } from '@udecode/plate-layout';
import { ResizableProvider } from '@udecode/plate-resizable';
import { withRef } from '@udecode/react-utils';
import { css } from 'emotion';

const columns: any = {
  padding: '0.375rem',
  width: '100%',
  height: '100%',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
};

interface TStyledColumnElement extends TColumnElement {
  align?: string
  style?: string
}

export const ColumnElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>(({ children, ...props }, ref) => {
    const { width, style, align } = useElement<TStyledColumnElement>();

    // style
    if (!style || style == 'text') {
      columns.border = '1px dashed darkgray !important';
      columns.backgroundColor = 'unset';
    } else if (style == 'outlined') {
      columns.border = '1px solid darkgray !important';
      columns.backgroundColor = 'unset';
    } else if (style == 'filled') {
      columns.border = 'none';
      columns.backgroundColor = tokens.gray200;
    }

    // align
    if (align == 'center') {
      columns.justifyContent = 'center'
    } else if (align == 'top') {
      columns.justifyContent = 'start'
    } else if (align == 'bottom') {
      columns.justifyContent = 'end'
    }

    return (
      <PlateElement ref={ref} style={{ width }} {...props}>
        <div className={css(columns)}>{children}</div>
      </PlateElement>
    );
  })
);
