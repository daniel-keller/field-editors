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
  alignItems?: string
  variant?: string
}

export const ColumnElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>(({ children, ...props }, ref) => {
    const { width, variant, alignItems } = useElement<TStyledColumnElement>();

    // variant
    if (!variant || variant == 'text') {
      columns.border = '1px dashed darkgray !important';
      columns.backgroundColor = 'unset';
    } else if (variant == 'outlined') {
      columns.border = '1px solid darkgray !important';
      columns.backgroundColor = 'unset';
    } else if (variant == 'filled') {
      columns.border = 'none';
      columns.backgroundColor = tokens.gray200;
    }

    // align
    if (alignItems == 'center') {
      columns.justifyContent = 'center'
    } else if (alignItems == 'top') {
      columns.justifyContent = 'start'
    } else if (alignItems == 'bottom') {
      columns.justifyContent = 'end'
    }

    return (
      <PlateElement ref={ref} style={{ width }} {...props}>
        <div className={css(columns)}>{children}</div>
      </PlateElement>
    );
  })
);
