
// import { FieldAppSDK } from '@contentful/app-sdk';
import { PlatePlugin } from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import IFrame from './components/IFrame';

export const createIFramePlugin = (): PlatePlugin => ({
  key: BLOCKS.IFRAME,
  type: BLOCKS.IFRAME,
  isVoid: true,
  isElement: true,
  component: IFrame,
  // TODO: determine the best way to identify html iframe
  // deserializeHtml: {
  //   rules: [
  //     {
  //       validAttribute: '',
  //     },
  //   ],
  // },
  exitBreak: [
    {
      // If enter is keyed exit iframe without adding a new iframe
      hotkey: 'enter',
      query: {
        allow: BLOCKS.IFRAME,
      },
    },
  ],
});
