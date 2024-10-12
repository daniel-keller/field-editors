import { isLastChild, hasSingleChild } from '@udecode/plate-common';

import { getAboveNode, getBlockAbove, isAncestorEmpty } from '../../internal/queries';
import { PlateEditor, Ancestor } from '../../internal/types';
import { BLOCKS, HEADINGS } from '../../rich-text-types/src';

/**
 * Returns true if we are:
 * 1) Inside a accordion
 * 2) With no only one child paragraph/heading and
 * 3) that child is empty
 */
export const shouldResetAccordionOnBackspace = (editor: PlateEditor) => {
  // If backspacing below the Title
  const container = getAboveNode(editor, {
    match: { type: [BLOCKS.PARAGRAPH, ...HEADINGS] },
    mode: 'lowest',
  });

  if (!container) {
    return false;
  }

  if (!isAncestorEmpty(editor, container[0] as Ancestor)) {
    return false;
  }


  const accordion = getBlockAbove(editor, {
    match: { type: BLOCKS.ACCORDION },
    mode: 'lowest',
  });

  console.log(!accordion);
  // if (!accordion) {
  //   return false;
  // }

  if (accordion && hasSingleChild(accordion[0]) && isLastChild(accordion, container[1])) {
    return true;
  }

  return false;
};
