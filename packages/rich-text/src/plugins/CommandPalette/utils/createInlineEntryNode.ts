import { INLINES } from '../../../rich-text-types/src';

export function createInlineEntryNode(id: string) {
  return {
    type: INLINES.EMBEDDED_ENTRY,
    children: [{ text: '' }],
    data: {
      target: {
        sys: {
          id,
          type: 'Link',
          linkType: 'Entry',
        },
      },
    },
  };
}
