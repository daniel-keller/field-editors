import { BaseRange, BaseSelection, Point } from 'slate';

import { getAboveNode, getText, isElement } from '../../internal/queries';
import { deleteText, insertNodes } from '../../internal/transforms';
import { BLOCKS, TEXT_CONTAINERS } from '../../rich-text-types/src';

export function insertAccordion(editor) {
  const { insertFragment } = editor;

  return function (fragment) {
    const startingNode = fragment.length && fragment[0];
    const startsWithAccordon =
      isElement(startingNode) && startingNode.type === BLOCKS.ACCORDION;

    const containerEntry = getAboveNode(editor, {
      match: {
        type: TEXT_CONTAINERS,
      },
    });

    const containerIsNotEmpty = containerEntry && getText(editor, containerEntry[1]) !== '';

    if (startsWithAccordon && containerIsNotEmpty) {
      const { selection } = editor;
      const isContentSelected = (selection: BaseSelection): selection is BaseRange =>
        !!selection && Point.compare(selection.anchor, selection.focus) !== 0;

      // if something is selected (highlighted) we replace the selection
      if (isContentSelected(selection)) {
        deleteText(editor, { at: selection });
      }

      // get the cursor entry again, it may be different after deletion
      const containerEntry = getAboveNode(editor, {
        match: {
          type: TEXT_CONTAINERS,
        },
      });

      const containerIsNotEmpty = containerEntry && getText(editor, containerEntry[1]) !== '';

      if (containerIsNotEmpty) {
        insertNodes(editor, fragment);
        return;
      }
    }

    insertFragment(fragment);
  };
}
