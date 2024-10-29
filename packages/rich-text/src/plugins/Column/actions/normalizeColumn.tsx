import { isElement, getLastChildPath, createPathRef } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';
import { insertEmptyColumn } from './insertEmpty';
import { moveMiddleColumn } from './moveMiddleColumn';
import { setColumnStyle } from './setColumnStyle';

const normalizeColumnHelper = (editor, entry) => {
  const [node, path] = entry;
  const prevChildrenCnt = node.children.length;
  const currentLayout = node.data.layout;
  const style = node.data.style;
  const align = node.data.align;

  if (!currentLayout) return;

  const currentChildrenCnt = currentLayout.length;
  const groupPathRef = createPathRef(editor, path);

  // up from 1
  if (prevChildrenCnt === 1) {
    const lastChildPath = getLastChildPath(entry);
    if (currentChildrenCnt === 2) {
      insertEmptyColumn(editor, { at: lastChildPath });
    }

    if (currentChildrenCnt === 3) {
      insertEmptyColumn(editor, { at: lastChildPath });
      insertEmptyColumn(editor, { at: lastChildPath });
    }
  }

  // up or down from 2
  if (prevChildrenCnt === 2) {
    if (currentChildrenCnt === 3) {
      const lastChildPath = getLastChildPath(entry);
      insertEmptyColumn(editor, { at: lastChildPath });
    }

    if (currentChildrenCnt === 1) {
      moveMiddleColumn(editor, entry, { direction: 'left' });
    }
  }

  // down from 3
  if (prevChildrenCnt === 3) {
    if (currentChildrenCnt === 2) {
      moveMiddleColumn(editor, entry, { direction: 'left' });
    }

    if (currentChildrenCnt === 1) {
      moveMiddleColumn(editor, entry, { direction: 'left' });
      moveMiddleColumn(editor, entry, { direction: 'left' });
    }
  }

  setColumnStyle(editor, groupPathRef, currentLayout, style, align);
};

export function normalizeColumn(editor) {
  const { normalizeNode } = editor;

  return function (entry) {
    if (isElement(entry[0]) && entry[0].type === BLOCKS.COLUMN_GROUP) {
      return normalizeColumnHelper(editor, entry);
    }
    return normalizeNode(entry);
  };
}
