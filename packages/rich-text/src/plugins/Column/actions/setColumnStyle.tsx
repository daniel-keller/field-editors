import { getNodeEntryFromSelection } from '../../../helpers/editor';
import { setNodes, isElement, getChildren } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';

export function setColumnStyle(editor, groupPathRef, layout, style?: string, align?: string) {
  const path = groupPathRef.unref();
  const columnGroup = getNodeEntryFromSelection(editor, BLOCKS.COLUMN_GROUP, path);

  if (!columnGroup || (Array.isArray(columnGroup) && columnGroup.length == 0)) {
    throw new Error(`can not find the column group in ${path}`);
  }

  const children = getChildren(columnGroup);
  const childPaths = Array.from(children, (item) => item[1]);

  childPaths.forEach((item, index) => {
    const width = layout[index] + '%';

    const data: any = { width };
    if (style) data.style = style;
    if (align) data.align = align;

    if (!width) return;
    setNodes(
      editor,
      data,
      {
        at: item,
        match: (n) => isElement(n) && n.type === BLOCKS.COLUMN,
      }
    );
  });
}
