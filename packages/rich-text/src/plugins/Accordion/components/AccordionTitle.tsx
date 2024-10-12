import * as React from 'react';

import { ChevronDownIcon } from '@contentful/f36-icons';
import { css } from 'emotion';

import { RenderElementProps } from '../../../internal';

const title = css({
  fontWeight: 'bold'
});

const bar = css({
  marginTop: '5px',
  borderBottom: '2px solid darkgrey',
  width: '100%'
});

const wrapper = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});


export default function AccordionTitle(props: RenderElementProps) {
  return (
    <div {...props.attributes} className={title}>
      <div className={wrapper}>
        <div>{props.children}</div>
        <div><ChevronDownIcon/></div>
      </div>
      <div contentEditable='false' className={bar}></div>
    </div>
  );
}
