import isHotkey from 'is-hotkey';

import { isNodeTypeSelected } from '../../helpers/editor';
import { isMarkActive } from '../../internal/queries';
import { toggleMark } from '../../internal/transforms';
import { PlateEditor, HotkeyPlugin, KeyboardHandler } from '../../internal/types';
import { MARKS, BLOCKS } from '../../rich-text-types/src';

export const toggleMarkAndDeactivateConflictingMarks = (editor: PlateEditor, mark: MARKS) => {
  const subs = [MARKS.SUPERSCRIPT, MARKS.SUBSCRIPT];
  const clear = subs.includes(mark) ? subs : [];
  toggleMark(editor, { key: mark, clear });
};

export const buildMarkEventHandler =
  (type: MARKS): KeyboardHandler<HotkeyPlugin> =>
  (editor, { options: { hotkey } }) =>
  (event) => {
    if (editor.selection && hotkey && isHotkey(hotkey, event) && !isNodeTypeSelected(editor, BLOCKS.ACCORDION_TITLE)) {
      event.preventDefault();

      const isActive = isMarkActive(editor, type);
      editor.tracking.onShortcutAction(isActive ? 'unmark' : 'mark', { markType: type });
      toggleMarkAndDeactivateConflictingMarks(editor, type);
    }
  };
