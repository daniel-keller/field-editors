import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { PlatePlugin } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';

export const createTrailingParagraphPlugin = (): PlatePlugin => {
  return createTrailingBlockPlugin({
    options: {
      type: BLOCKS.PARAGRAPH,
      level: 0,
    },
  });
};
