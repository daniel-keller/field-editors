
import { transformParagraphs, transformLift } from '../../helpers/transformers';
import { PlatePlugin } from '../../internal/types';
import { BLOCKS, CONTAINERS } from '../../rich-text-types/src';
import Accordion from './components/Accordion';
import AccordionTitle from './components/AccordionTitle';
import { onKeyDownToggleAccordion } from './toggleAccordion';
import {
  accordionHasTitle,
  unwrapAccordion,
  hasAccorionAsDirectParent
} from './utils';

export const createAccordionTitlePlugin = (): PlatePlugin => ({
  key: BLOCKS.ACCORDION_TITLE,
  type: BLOCKS.ACCORDION_TITLE,
  isElement: true,
  component: AccordionTitle,
  normalizer: [
    {
      // Transform Titles without Accordions
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
  // TODO: determine the best way to identify html accordion
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
    // Unwrap Accordion without title
    {
      match: {type: BLOCKS.ACCORDION},
      validNode: accordionHasTitle,
      transform: unwrapAccordion,
    },
  ],
});
