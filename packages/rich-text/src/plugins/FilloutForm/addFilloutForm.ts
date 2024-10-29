import isHotkey from 'is-hotkey';

import { isBlockSelected } from '../../helpers/editor';
import {
  withoutNormalizing,
  insertNodes,
  unwrapNodes,
  isElement,
} from '../../internal';
import { KeyboardHandler, HotkeyPlugin, PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';

export function addFilloutForm(
  editor: PlateEditor,
  logAction?: TrackingPluginActions['onShortcutAction'] | TrackingPluginActions['onToolbarAction']
): void {
  if (!editor.selection) return;
  const isActive = isBlockSelected(editor, BLOCKS.FILLOUT_FORM);

  logAction?.(isActive ? 'removeFillout' : 'insertFillout', { nodeType: BLOCKS.FILLOUT_FORM });

  withoutNormalizing(editor, () => {
    if (!editor.selection) return;

    unwrapNodes(editor, {
      match: (node) => isElement(node) && node.type === BLOCKS.FILLOUT_FORM,
      split: false
    });

    if (!isActive) {
      const gallery = {
        type: BLOCKS.FILLOUT_FORM,
        data: {},
        children: [{ text: '' }],
        isVoid: true,
      };

      insertNodes(editor, gallery);
    }
  });
}

export const onKeyDownAddFilloutForm: KeyboardHandler<HotkeyPlugin> = (editor, plugin) => (event) => {
  const { hotkey } = plugin.options;

  // Toggle on HotKey
  if (hotkey && isHotkey(hotkey, event)) {
    event.preventDefault();
    addFilloutForm(editor, editor.tracking.onShortcutAction);
  }
};
