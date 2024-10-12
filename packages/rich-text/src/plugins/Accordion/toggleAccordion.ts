import isHotkey from 'is-hotkey';

import { isBlockSelected } from '../../helpers/editor';
import { withoutNormalizing, wrapNodes, unwrapNodes, isElement } from '../../internal';
import { KeyboardHandler, HotkeyPlugin, PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';
import { defaultAccordionChildren } from './utils';

export function toggleAccordion(
  editor: PlateEditor,
  logAction?: TrackingPluginActions['onShortcutAction'] | TrackingPluginActions['onToolbarAction']
): void {
  if (!editor.selection) return;

  const isActive = isBlockSelected(editor, BLOCKS.ACCORDION);

  logAction?.(isActive ? 'remove' : 'insert', { nodeType: BLOCKS.ACCORDION });

  withoutNormalizing(editor, () => {
    if (!editor.selection) return;

    unwrapNodes(editor, {
      match: (node) => isElement(node) && node.type === BLOCKS.ACCORDION,
      split: true,
    });

    if (!isActive) {
      const accordion = {
        type: BLOCKS.ACCORDION,
        data: {},
        children: defaultAccordionChildren,
      };

      wrapNodes(editor, accordion);
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
