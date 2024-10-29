
// import { FieldAppSDK } from '@contentful/app-sdk';
import { PlatePlugin } from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import { onKeyDownAddFilloutForm } from './addFilloutForm';
import FilloutForm from './components/FilloutForm';

export const createFilloutFormPlugin = (): PlatePlugin => ({
  key: BLOCKS.FILLOUT_FORM,
  type: BLOCKS.FILLOUT_FORM,
  isVoid: true,
  isElement: true,
  component: FilloutForm,
  handlers: {
    onKeyDown: onKeyDownAddFilloutForm,
  },
  // TODO: determine the best way to identify html asset gallery
  // deserializeHtml: {
  //   rules: [
  //     {
  //       validAttribute: '',
  //     },
  //   ],
  // },
  exitBreak: [
    {
      // If enter is keyed exit fillout form without adding a new fillout form
      hotkey: 'enter',
      query: {
        allow: BLOCKS.FILLOUT_FORM,
      },
    },
  ],
});
