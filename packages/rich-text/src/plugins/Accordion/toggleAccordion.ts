import isHotkey from 'is-hotkey';

import { isBlockSelected } from '../../helpers/editor';
import { withoutNormalizing, insertNodes, unwrapNodes, isElement } from '../../internal';
import { KeyboardHandler, HotkeyPlugin, PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';

export function toggleAccordion(
  editor: PlateEditor,
  logAction?: TrackingPluginActions['onShortcutAction'] | TrackingPluginActions['onToolbarAction']
): void {
  if (!editor.selection) return;

  const isTitleActive = isBlockSelected(editor, BLOCKS.ACCORDION_TITLE);
  const isAccordionActive = isBlockSelected(editor, BLOCKS.ACCORDION);

  logAction?.(isTitleActive || isAccordionActive ? 'removeAccordion' : 'insertAccordion', { nodeType: BLOCKS.ACCORDION });

  withoutNormalizing(editor, () => {
    if (!editor.selection) return;

    unwrapNodes(editor, {
      match: (node) => {console.log(node); return isElement(node) && node.type === BLOCKS.ACCORDION},
      split: false
    });

    if (!isTitleActive && !isAccordionActive) {
      const accordion = {
        type: BLOCKS.ACCORDION,
        data: {},
        children: [
          {
            type: BLOCKS.ACCORDION_TITLE,
            children: [{ text: 'Untitled' }],
          },
          {
            type: BLOCKS.PARAGRAPH,
            children: [{ text: '' }],
          }
        ],
      };

      insertNodes(editor, accordion);
    }
  });
}

export const onKeyDownToggleAccordion: KeyboardHandler<HotkeyPlugin> = (editor, plugin) => (event) => {
  const { hotkey } = plugin.options;

  if (hotkey && isHotkey(hotkey, event)) {
    event.preventDefault();
    toggleAccordion(editor, editor.tracking.onShortcutAction);
  }
};
