import { FieldAppSDK } from '@contentful/app-sdk';

import { PlatePlugin } from '../../internal';
import { INLINES } from '../../rich-text-types/src';
import { getWithEmbeddedEntryInlineEvents } from '../shared/EmbeddedInlineUtil';
import { LinkedEntityInline } from './LinkedEntityInline';

const entityTypes = {
  [INLINES.EMBEDDED_ENTRY]: 'Entry',
  [INLINES.EMBEDDED_ASSET]: 'Asset',
};

const createEmbeddedEntityPlugin =
  (nodeType: INLINES.EMBEDDED_ENTRY | INLINES.EMBEDDED_ASSET, hotkey: string) =>
  (sdk: FieldAppSDK): PlatePlugin => ({
    key: nodeType,
    type: nodeType,
    isElement: true,
    isInline: true,
    isVoid: true,
    component: LinkedEntityInline,
    options: { hotkey },
    handlers: {
      onKeyDown: getWithEmbeddedEntryInlineEvents(nodeType, sdk),
    },
    deserializeHtml: {
      rules: [
        {
          validAttribute: {
            'data-entity-type': entityTypes[nodeType],
          },
        },
      ],
      withoutChildren: true,
      getNode: (el) => ({
        type: nodeType,
        children: [{ text: '' }],
        isVoid: true,
        data: {
          target: {
            sys: {
              id: el.getAttribute('data-entity-id'),
              linkType: el.getAttribute('data-entity-type'),
              type: 'Link',
            },
          },
        },
      }),
    },
  });

export const createEmbeddedEntryInlinePlugin = createEmbeddedEntityPlugin(
  INLINES.EMBEDDED_ENTRY,
  'mod+shift+2'
);
export const createEmbeddedAssetInlinePlugin = createEmbeddedEntityPlugin(
  INLINES.EMBEDDED_ASSET,
  'mod+shift+3'
);
