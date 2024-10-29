import { FieldAppSDK } from '@contentful/app-sdk';
import { PlateProps } from '@udecode/plate-common';

import { PlatePlugin } from '../internal/types';
import { createAccordionPlugin, createAccordionTitlePlugin, createAccordionBodyPlugin } from './Accordion';
import { createAlignPlugin } from './Align';
import { createAssetGalleryPlugin } from './AssetGallery';
import { createSoftBreakPlugin, createExitBreakPlugin, createResetNodePlugin } from './Break';
import { createColumnPlugin } from './Column';
import { createCommandPalettePlugin } from './CommandPalette';
import { isCommandPromptPluginEnabled } from './CommandPalette/useCommands';
import { createDeserializeDocxPlugin } from './DeserializeDocx';
import { createDragAndDropPlugin } from './DragAndDrop';
import {
  createEmbeddedAssetBlockPlugin,
  createEmbeddedEntryBlockPlugin,
} from './EmbeddedEntityBlock';
import {
  createEmbeddedEntryInlinePlugin,
  createEmbeddedAssetInlinePlugin,
} from './EmbeddedEntityInline';
import { createEmbeddedResourceBlockPlugin } from './EmbeddedResourceBlock';
import { createEmbeddedResourceInlinePlugin } from './EmbeddedResourceInline';
import { createHeadingPlugin } from './Heading';
import { createHrPlugin } from './Hr';
import { createHyperlinkPlugin } from './Hyperlink';
import { createListPlugin } from './List';
import { createMarksPlugin } from './Marks';
import { createNormalizerPlugin } from './Normalizer';
import { createParagraphPlugin } from './Paragraph';
import { createPasteHTMLPlugin } from './PasteHTML';
import { createQuotePlugin } from './Quote';
import { createSelectOnBackspacePlugin } from './SelectOnBackspace';
import { createTablePlugin } from './Table';
import { createTextPlugin } from './Text';
import { createTrackingPlugin, RichTextTrackingActionHandler } from './Tracking';
import { createTrailingParagraphPlugin } from './TrailingParagraph';
import { createVoidsPlugin } from './Voids';
import { createIFramePlugin } from './IFrame';
import { createFilloutFormPlugin } from './FilloutForm';

export const getPlugins = (
  sdk: FieldAppSDK,
  onAction: RichTextTrackingActionHandler,
  restrictedMarks?: string[]
): PlatePlugin[] => [
  createDeserializeDocxPlugin(),

  // Tracking - This should come first so all plugins below will have access to `editor.tracking`
  createTrackingPlugin(onAction),

  // Global / Global shortcuts
  createDragAndDropPlugin(),
  // Enable command palette plugin only, if at least action type is allowed
  ...(Object.values(isCommandPromptPluginEnabled(sdk)).some(Boolean)
    ? [createCommandPalettePlugin()]
    : []),

  // Block Elements
  createParagraphPlugin(),
  createListPlugin(),
  createHrPlugin(),
  createHeadingPlugin(),
  createQuotePlugin(),
  createAccordionPlugin(),
  createAccordionTitlePlugin(),
  createAccordionBodyPlugin(),
  createColumnPlugin(),
  createTablePlugin(),
  createAlignPlugin(),
  createEmbeddedEntryBlockPlugin(sdk),
  createEmbeddedAssetBlockPlugin(sdk),
  createEmbeddedResourceBlockPlugin(sdk),
  createAssetGalleryPlugin(),
  createIFramePlugin(),
  createFilloutFormPlugin(),

  // Inline elements
  createHyperlinkPlugin(sdk),
  createEmbeddedEntryInlinePlugin(sdk),
  createEmbeddedAssetInlinePlugin(sdk),
  createEmbeddedResourceInlinePlugin(sdk),

  // Marks
  createMarksPlugin(),

  // Other
  createTrailingParagraphPlugin(),
  createTextPlugin(restrictedMarks),
  createVoidsPlugin(),
  createSelectOnBackspacePlugin(),

  // Pasting content from other sources
  createPasteHTMLPlugin(),

  // These plugins drive their configurations from the list of plugins
  // above. They MUST come last.
  createSoftBreakPlugin(),
  createExitBreakPlugin(),
  createResetNodePlugin(),
  createNormalizerPlugin(),
];

export const disableCorePlugins: PlateProps['disableCorePlugins'] = {
  // Note: Enabled by default since v9.0.0 but it causes Cypress's
  // .click() command to fail
  eventEditor: true,
};
