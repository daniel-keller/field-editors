import * as React from 'react';

import { ChevronDownIcon } from '@contentful/f36-icons';
import { css } from 'emotion';

import { RenderElementProps } from '../../../internal';


const title = css({
  fontWeight: 'bold',
  borderBottom: '2px solid darkgrey'
});

export default function AccordionTitle(props: RenderElementProps) {

  return (
    <div {...props.attributes}>
      <div className={title}>
        <div className={css`width: 100%`}>{props.children}</div>
      </div>
    </div>
  );
}
