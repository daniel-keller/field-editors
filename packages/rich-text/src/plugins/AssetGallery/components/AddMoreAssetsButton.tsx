import * as React from 'react';

import { css } from 'emotion';
import { Button } from '@contentful/f36-components';
import { PlusIcon } from '@contentful/f36-icons';

// import { useContentfulEditor } from '../../../ContentfulEditorProvider';
// import { getNodeEntryFromSelection } from '../../../helpers/editor';
// import { RenderElementProps, setNodes } from '../../../internal';
// import { BLOCKS } from '../../../rich-text-types/src';

interface Props {
  onClick: (e) => void
}
const style = css`
  display: flex;
  align-items: center;
`;

export default function AddMoreAssetsButton(props: Props) {
  return (
    <Button contentEditable={false}
      onClick={props.onClick}
      className={style}
    >
      <PlusIcon/> Add Assets
    </Button>
  );
}
