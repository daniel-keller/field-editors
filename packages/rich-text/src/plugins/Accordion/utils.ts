import {
  getChildren,
  getParentNode,
} from '../../internal/queries';
import { insertNodes } from '../../internal/transforms';
import { NodeEntry, PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';

export const defaultAccordionChildren = [
  {
    type: BLOCKS.ACCORDION_TITLE,
    children: [{ text: 'Untitled' }],
  },
  {
    type: BLOCKS.PARAGRAPH,
    children: [{ text: '' }],
  }
];

export const hasAccorionAsDirectParent = (editor: PlateEditor, [, path]: NodeEntry) => {
  const [parentNode] = (getParentNode(editor, path) || []) as NodeEntry;
  return parentNode.type == BLOCKS.ACCORDION;
};

export const insertTitleAndParagraphAsChild = (editor: PlateEditor, [, path]: NodeEntry) => {
  insertNodes(editor, defaultAccordionChildren, { at: path.concat([0]) });
};

export const isNonEmptyAccordion = (_: PlateEditor, entry: NodeEntry) => {
  const children = getChildren(entry);

  return children.length !== 0;
};

export const firstNodeIsTitle = (_editor: PlateEditor, entry: NodeEntry) => {
  const children = getChildren(entry);
  if (children.length >= 1) {
    const firstNode = children[0];

    return firstNode[0].type == BLOCKS.ACCORDION_TITLE;
  }

  return false;
};

export const insertTitle = (editor: PlateEditor, entry: NodeEntry) => {
  const [, path] = entry;

  insertNodes(editor, [defaultAccordionChildren[0]], { at: path.concat([0]) });
};



// export const isListTypeActive = (editor: PlateEditor, type: BLOCKS): boolean => {
//   const { selection } = editor;

//   if (!selection) {
//     return false;
//   }

//   if (isRangeExpanded(selection)) {
//     const [start, end] = getRangeEdges(selection);
//     const node = getCommonNode(editor, start.path, end.path);

//     if (node[0].type === type) {
//       return true;
//     }
//   }

//   // Lists can be nested. Here, we take the list type at the lowest level
//   const listNode = getBlockAbove(editor, {
//     match: {
//       type: [BLOCKS.OL_LIST, BLOCKS.UL_LIST],
//     },
//     mode: 'lowest',
//   });

//   return listNode?.[0].type === type;
// };
