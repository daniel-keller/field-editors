import { createSelectOnBackspacePlugin as createDefaultSelectPlugin } from '@udecode/plate-select';

import { PlatePlugin } from '../../internal/types';
import { INLINES } from '../../rich-text-types/src';

export const createSelectOnBackspacePlugin = (): PlatePlugin =>
  createDefaultSelectPlugin({
    options: {
      query: {
        // `createTextPlugin` is taking care of block elements
        allow: [INLINES.EMBEDDED_ENTRY, INLINES.EMBEDDED_ASSET],
      },
    },
  });
