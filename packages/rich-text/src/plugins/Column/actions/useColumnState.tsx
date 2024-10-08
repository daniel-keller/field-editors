import { useElement } from '@udecode/plate-common';

import { useContentfulEditorRef } from '../../../ContentfulEditorProvider';
import { findNodePath, setNodes } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';

export function useColumnState() {
  const editor = useContentfulEditorRef();
  const columnGroupElement = useElement(BLOCKS.COLUMN_GROUP);
  const columnPath = findNodePath(editor, columnGroupElement);

  const data = columnGroupElement.data as any;

  const setSingleColumn = () => {
    setNodes(editor, { data: { ...data, layout: [100] } }, { at: columnPath });
  };
  const setDoubleColumn = () => {
    setNodes(editor, { data: { ...data, layout: [50, 50] } }, { at: columnPath });
  };
  const setThreeColumn = () => {
    setNodes(editor, { data: { ...data, layout: [33, 33, 33] } }, { at: columnPath });
  };
  const setRightSideDoubleColumn = () => {
    setNodes(editor, { data: { ...data, layout: [70, 30] } }, { at: columnPath });
  };
  const setLeftSideDoubleColumn = () => {
    setNodes(editor, { data: { ...data, layout: [30, 70] } }, { at: columnPath });
  };
  const setDoubleSideDoubleColumn = () => {
    setNodes(editor, { data: { ...data, layout: [25, 50, 25] } }, { at: columnPath });
  };
  const setGap = (gap: number) => {
    setNodes(editor, { data: { ...data, gap: gap } }, { at: columnPath });
  };

  return {
    setSingleColumn,
    setDoubleColumn,
    setDoubleSideDoubleColumn,
    setLeftSideDoubleColumn,
    setRightSideDoubleColumn,
    setThreeColumn,
    setGap,
  };
}
