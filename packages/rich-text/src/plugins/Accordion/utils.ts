import {
  getChildren,
  getParentNode,
  NodeEntry,
  PlateEditor,
  unwrapNodes,
  isFirstChild
} from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';

export const hasAccorionAsDirectParent = (editor: PlateEditor, [, path]: NodeEntry) => {
  const [parentNode] = (getParentNode(editor, path) || []) as NodeEntry;
  return parentNode.type == BLOCKS.ACCORDION && isFirstChild(path);
};


export const accordionHasTitle = (_: PlateEditor, entry: NodeEntry) => {
  const children = getChildren(entry);

  return children.length >= 1 && children[0][0]?.type == BLOCKS.ACCORDION_TITLE;
};

export const unwrapAccordion = (editor: PlateEditor, entry: NodeEntry) => {
  const [, path] = entry;

  unwrapNodes(editor, {at: path, split: false});
};
