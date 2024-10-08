
import { isBlock } from '@udecode/plate-common';

import { setNodes, unsetNodes } from '../../internal/transforms';
import { PlatePlugin, PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';

export const KEY_ALIGN = 'align';
export type AlignValuesType = 'left' | 'right' | 'center';
export const alignValues = ['left', 'right', 'center'];
export const defaultAlignValue = 'left';

const validTypes = [
  BLOCKS.PARAGRAPH,
  BLOCKS.HEADING_1,
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
];

export const setAlign = (editor: PlateEditor, align: AlignValuesType) => {
  const match = (n) => {
    return isBlock(editor, n) && !!validTypes && validTypes.includes(n.type as BLOCKS);
  };

  if (align === defaultAlignValue) {
    // TODO: this will remove all data on node but 'data.align' doesn't work?
    unsetNodes(editor, 'data', { ...match });
  } else {
    setNodes(editor, { data: { [KEY_ALIGN]: align } }, { ...match });
  }
};

export const createAlignPlugin = (): PlatePlugin => ({
  key: KEY_ALIGN,
  inject: {
    props: {
      validTypes: validTypes,
    },
  },
});
