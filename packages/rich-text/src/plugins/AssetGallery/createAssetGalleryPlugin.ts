
// import { FieldAppSDK } from '@contentful/app-sdk';
import { deleteText, getParentNode, isText, PlatePlugin } from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import { onKeyDownAddAssetGallery } from './addAssetGallery';
import AssetGallery from './components/AssetGallery';
import { isEmbeddedAssetOrText } from './utils';

export const createAssetGalleryPlugin = (): PlatePlugin => ({
  key: BLOCKS.ASSET_GALLERY,
  type: BLOCKS.ASSET_GALLERY,
  isElement: true,
  component: AssetGallery,
  handlers: {
    onKeyDown: onKeyDownAddAssetGallery,
  },
  // TODO: determine the best way to identify html asset gallery
  // deserializeHtml: {
  //   rules: [
  //     {
  //       validAttribute: '',
  //     },
  //   ],
  // },
  normalizer: [
    {
      // Only allow embedded assets or text nodes
      validChildren: (_, entry) => isEmbeddedAssetOrText(entry),
    },
    {
      // immediate Text nodes children in Asset Gallery must be empty
      match: isText,
      validNode: (editor, [node, path]) => {
        const [parentNode] = getParentNode(editor, path) ?? [];
        return parentNode?.type != BLOCKS.ASSET_GALLERY || node.text == '';
      },
      transform: (editor, [, path]) => {
        deleteText(editor, {at: path});
      },
    },
  ],
  exitBreak: [
    {
      // If enter is keyed exit gallery without adding a new gallery
      hotkey: 'enter',
      query: {
        allow: BLOCKS.ASSET_GALLERY,
      },
    },
  ],
});
