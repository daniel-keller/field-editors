import * as React from 'react';

import { css } from 'emotion';

import { RenderElementProps } from '../../../internal';


export default function AccordionBody(props: RenderElementProps) {
  return (
    <div {...props.attributes}>
        <div className={css`width: 100%`}>{props.children}</div>
    </div>
  );
}
