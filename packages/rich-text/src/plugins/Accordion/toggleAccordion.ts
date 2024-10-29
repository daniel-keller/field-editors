import { isBlockSelected } from '../../helpers/editor';
import {
  withoutNormalizing,
  insertNodes,
  unwrapNodes,
  isElement,
  PlateEditor
} from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';

export const defaultAccordionBody = {
  type: BLOCKS.ACCORDION_BODY,
  children: [{ type: BLOCKS.PARAGRAPH, children: [{ text: '' }] }],
}

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
      match: (node) => isElement(node) && node.type === BLOCKS.ACCORDION,
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
          {...defaultAccordionBody}
        ],
      };

      insertNodes(editor, accordion);
    }
  });
}
