import {
  getChildren,
  getParentNode,
  NodeEntry,
  PlateEditor,
  unwrapNodes,
  insertNodes,
} from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import { defaultAccordionBody } from './toggleAccordion';

export const hasAccorionAsDirectParent = (editor: PlateEditor, [, path]: NodeEntry) => {
  const [parentNode] = (getParentNode(editor, path) || []) as NodeEntry;
  return parentNode.type == BLOCKS.ACCORDION; //&& isFirstChild(path);
};

export const accordionHasTitle = (_: PlateEditor, entry: NodeEntry) => {
  const children = getChildren(entry);

  return children.length >= 1 && children[0][0]?.type == BLOCKS.ACCORDION_TITLE;
};

export const accordionHasBody = (_: PlateEditor, entry: NodeEntry) => {
  const children = getChildren(entry);
  return children.length == 2 && children[1][0]?.type == BLOCKS.ACCORDION_BODY;
};


export const hasBodyAsDirectSybling = (editor: PlateEditor, entry: NodeEntry) => {
  const [, path] = entry;
  const [parent] = (getParentNode(editor, path) ?? []) as NodeEntry;

  console.log(parent.children, parent.children?.[1]?.type);

  if (parent?.children && Array.isArray(parent.children)) {
    return parent.children.length >= 2 && parent.children?.[1]?.type == BLOCKS.ACCORDION_BODY;
  }
  return false;
};

export const insertBody = (editor: PlateEditor, [node, path]: NodeEntry) => {
  if (node.type == BLOCKS.ACCORDION) {
    insertNodes(editor, {...defaultAccordionBody}, {at: [...path, 1]});
  }
}

export const unwrapAccordion = (editor: PlateEditor, entry: NodeEntry) => {
  const [, path] = entry;

  unwrapNodes(editor, {at: path, split: false});
};
