import { isBlockSelected } from '../../helpers/editor';
import {
  withoutNormalizing,
  insertNodes,
  unwrapNodes,
  isElement,
} from '../../internal';
import { PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';

export function addIFrame(
  editor: PlateEditor,
  logAction?: TrackingPluginActions['onShortcutAction'] | TrackingPluginActions['onToolbarAction']
): void {
  if (!editor.selection) return;
  const isActive = isBlockSelected(editor, BLOCKS.IFRAME);

  logAction?.(isActive ? 'removeIFrame' : 'insertIFrame', { nodeType: BLOCKS.IFRAME });

  withoutNormalizing(editor, () => {
    if (!editor.selection) return;

    unwrapNodes(editor, {
      match: (node) => isElement(node) && node.type === BLOCKS.IFRAME,
      split: false
    });

    if (!isActive) {
      const gallery = {
        type: BLOCKS.IFRAME,
        data: {url: ''},
        children: [{ text: '' }],
        isVoid: true,
      };

      insertNodes(editor, gallery);
    }
  });
}
