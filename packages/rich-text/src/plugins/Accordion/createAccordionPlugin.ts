
// import { transformLift, transformUnwrap } from '../../helpers/transformers';
import { transformParagraphs, transformLift } from '../../helpers/transformers';
import { PlatePlugin } from '../../internal/types';
import { BLOCKS, CONTAINERS } from '../../rich-text-types/src';
import Accordion from './components/Accordion';
import AccordionTitle from './components/AccordionTitle';
import { shouldResetAccordionOnBackspace } from './shouldResetAccordion';
import { onKeyDownToggleAccordion, toggleAccordion } from './toggleAccordion';
import { firstNodeIsTitle, hasAccorionAsDirectParent, insertTitleAndParagraphAsChild, isNonEmptyAccordion, insertTitle } from './utils';

export const createAccordionTitlePlugin = (): PlatePlugin => ({
  key: BLOCKS.ACCORDION_TITLE,
  type: BLOCKS.ACCORDION_TITLE,
  isElement: true,
  component: AccordionTitle,
  normalizer: [
    {
      match: {type: BLOCKS.ACCORDION_TITLE},
      validNode: hasAccorionAsDirectParent,
      transform: transformParagraphs,
    },
  ],
  exitBreak: [
    {
      // If enter is keyed in the Title entire new paragraph not title
      hotkey: 'enter',
      before: false,
      relative: true,
      level: 1,
      query: {
        allow: BLOCKS.ACCORDION_TITLE,
      },
    },
  ],
});

/**
 * In an Accordion the
 * @returns
 */
export const createAccordionPlugin = (): PlatePlugin => ({
  key: BLOCKS.ACCORDION,
  type: BLOCKS.ACCORDION,
  isElement: true,
  component: Accordion,
  options: {
    hotkey: 'mod+shift+8',
  },
  handlers: {
    onKeyDown: onKeyDownToggleAccordion,
  },
  // TODO: determine the best way to identify accordion
  // deserializeHtml: {
  //   rules: [
  //     {
  //       validAttribute: '',
  //     },
  //   ],
  // },
  normalizer: [
    // Only valid children
    {
      validChildren: CONTAINERS[BLOCKS.ACCORDION],
      transform: transformLift,
    },
    // No empty accordions
    {
      match: {type: BLOCKS.ACCORDION},
      validNode: isNonEmptyAccordion,
      transform: insertTitleAndParagraphAsChild,
    },
    // Accordion title must be first
    {
      match: {type: BLOCKS.ACCORDION},
      validNode: firstNodeIsTitle,
      transform: insertTitle,
    },

    // {
    //   match: [BLOCKS.ACCORDION_TITLE],
    //   validNode: hasAccorionAsDirectParent,
    //   transform: transformParagraphs,
    // },
  ],
  resetNode: [
    {
      // toggle off blockquote on backspace when it's empty
      hotkey: 'backspace',
      types: [BLOCKS.ACCORDION_TITLE],
      predicate: shouldResetAccordionOnBackspace,
      onReset: toggleAccordion,
    },
  ],
  // overrideByKey: {
  //   [BLOCKS.ACCORDION_TITLE]: {
  //     type: BLOCKS.ACCORDION_TITLE,
  //     component: AccordionTitle,
  //     // @ts-expect-error
  //     normalizer: [
  //       {
  //         validNode: hasAccorionAsDirectParent,
  //         transform: transformParagraphs,
  //       },
  //     ],
  //   },
  //   [BLOCKS.ACCORDION]: {
  //     type: BLOCKS.ACCORDION,
  //     component: Accordion,
  //     // normalizer: [
  //     //   // Only valid children
  //     //   {
  //     //     validChildren: CONTAINERS[BLOCKS.ACCORDION],
  //     //     transform: transformLift,
  //     //   },
  //     //   // No empty accordions
  //     //   {
  //     //     validNode: isNonEmptyAccordion,
  //     //     transform: insertTitleAndParagraphAsChild,
  //     //   },
  //     //   {
  //     //     validNode: firstNodeIsTitle,
  //     //     transform: insertTitle,
  //     //   },
  //     // ],
  //   },
  // },
});
