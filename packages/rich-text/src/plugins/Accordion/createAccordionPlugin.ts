
import { transformLift, transformParagraphs, transformUnwrap } from '../../helpers/transformers';
import { PlatePlugin } from '../../internal/types';
import { BLOCKS, CONTAINERS } from '../../rich-text-types/src';
import Accordion from './components/Accordion';
import AccordionBody from './components/AccordionBody';
import AccordionTitle from './components/AccordionTitle';
import {
  accordionHasTitle,
  unwrapAccordion,
  insertBody,
  hasAccorionAsDirectParent,
  accordionHasBody
} from './utils';

/**
 * Accordion Title
 * @returns
 */[]
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
  // TODO: determine the best way to identify html accordion title
  // deserializeHtml: {
  //   rules: [
  //     {
  //       validAttribute: '',
  //     },
  //   ],
  // },
  exitBreak: [
    {
      // If enter is keyed in the Title entire new paragraph not title
      hotkey: 'enter',
      before: false,
      query: {
        allow: BLOCKS.ACCORDION_TITLE,
      },
    },
  ],
});

/**
 * Accordion Body
 * @returns
 */
export const createAccordionBodyPlugin = (): PlatePlugin => ({
  key: BLOCKS.ACCORDION_BODY,
  type: BLOCKS.ACCORDION_BODY,
  isElement: true,
  component: AccordionBody,
  normalizer: [
    {
      validChildren: CONTAINERS[BLOCKS.ACCORDION_BODY],
      transform: transformLift,
    },
    {
      // Transform Accodion Body without Accordions
      match: {type: BLOCKS.ACCORDION_BODY},
      validNode: hasAccorionAsDirectParent,
      transform: transformUnwrap,
    },
  ],

  // TODO: determine the best way to identify html accordion title
  // deserializeHtml: {
  //   rules: [
  //     {
  //       validAttribute: '',
  //     },
  //   ],
  // },
  exitBreak: [
    {
      // If enter is keyed in the Title entire new paragraph not title
      hotkey: 'enter',
      before: false,
      relative: true,
      level: 1,
      query: {
        allow: BLOCKS.ACCORDION_BODY,
      },
    },
  ],
});

/**
 * Accordion wrapper
 * @returns
 */
export const createAccordionPlugin = (): PlatePlugin => ({
  key: BLOCKS.ACCORDION,
  type: BLOCKS.ACCORDION,
  isElement: true,
  component: Accordion,
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
    // Force Accordion Body to exist
    {
      match: {type: BLOCKS.ACCORDION},
      validNode: accordionHasBody,
      transform: insertBody,
    },
  ],
});
