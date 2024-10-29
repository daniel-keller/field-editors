import {
  NodeEntry,
  isText,
  isElement,
  getParentNode
} from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';

export const isEmbeddedAssetOrText = ([node]: NodeEntry) => {
  return isText(node) || (isElement(node) && node.type == BLOCKS.EMBEDDED_ASSET);
};

export const isEmptyText = (_, [node]: NodeEntry) => {
  return isText(node) && node.text == '';
};

export const isTextInAssetGallery = (editor, [node, path]: NodeEntry) => {
  if (isText(node)) {
    const [parentNode] = (getParentNode(editor, path) || []) as NodeEntry;
    return parentNode.type == BLOCKS.ASSET_GALLERY;
  }
  return false;
}

export const makeTextEmpty = (_, [node]: NodeEntry) => {
  return isText(node) && node.text == '';
};
