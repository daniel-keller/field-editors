import { isHotkey, select } from '@udecode/plate-common';

import { getParentNode } from '../../../internal/queries';

export function onKeyDownColumn(editor) {
  return (e) => {
    if (e.defaultPrevented) {
      return;
    }
    const at = editor.selection;

    if (isHotkey('mod+a', e) && at) {
      const selectionParent = getParentNode(editor, at);
      if (!selectionParent) return;

      const [, parentPath] = selectionParent;
      parentPath.pop();

      select(editor, parentPath);
      e.preventDefault();
      e.stopPropagation();
    }
  };
}
