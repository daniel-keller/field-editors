import { isCollapsed, useEditorSelector } from '@udecode/plate-common';
import { useSelected } from 'slate-react';

export function useDebouncePopoverOpen() {
  const selected = useSelected();
  const selectionCollapsed = useEditorSelector((editor) => isCollapsed(editor.selection), []);
  return selected && selectionCollapsed;
}
