import { FieldAppSDK } from '@contentful/app-sdk';

import { PlatePlugin } from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import { getWithEmbeddedBlockEvents } from '../shared/EmbeddedBlockUtil';
import { LinkedEntityBlock } from './LinkedEntityBlock';

const entityTypes = {
  [BLOCKS.EMBEDDED_ENTRY]: 'Entry',
  [BLOCKS.EMBEDDED_ASSET]: 'Asset',
};

const createEmbeddedEntityPlugin =
  (nodeType: BLOCKS.EMBEDDED_ENTRY | BLOCKS.EMBEDDED_ASSET, hotkey: string) =>
  (sdk: FieldAppSDK): PlatePlugin => ({
    key: nodeType,
    type: nodeType,
    isVoid: true,
    isElement: true,
    component: LinkedEntityBlock,
    options: { hotkey },
    handlers: {
      onKeyDown: getWithEmbeddedBlockEvents(nodeType, sdk),
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

export const createEmbeddedEntryBlockPlugin = createEmbeddedEntityPlugin(
  BLOCKS.EMBEDDED_ENTRY,
  'mod+shift+e'
);
export const createEmbeddedAssetBlockPlugin = createEmbeddedEntityPlugin(
  BLOCKS.EMBEDDED_ASSET,
  'mod+shift+a'
);
