import { getQueryOptions, withoutNormalizing } from '@udecode/plate-common';

import { insertNodes } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';

export function insertEmptyColumn(editor, options) {
  const width = (options == null ? 0 : options.width) || '33%';
  insertNodes(
    editor,
    {
      type: BLOCKS.COLUMN,
      children: [{ type: BLOCKS.PARAGRAPH, children: [{ text: '' }] }],
      width,
    },
    getQueryOptions(editor, options)
  );
}

export function insertColumnGroup(editor) {
  withoutNormalizing(editor, () => {
    insertNodes(editor, {
      type: BLOCKS.COLUMN_GROUP,
      data: { layout: [50, 50]},
      children: [
        {
          type: BLOCKS.COLUMN,
          width: '50%',
          children: [{ type: BLOCKS.PARAGRAPH, children: [{ text: '' }] }],
        },
        {
          type: BLOCKS.COLUMN,
          width: '50%',
          children: [{ type: BLOCKS.PARAGRAPH, children: [{ text: '' }] }],
        },
      ],
    });
  });
}
