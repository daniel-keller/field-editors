/**
 * Map of all Contentful block types. Blocks contain inline or block nodes.
 */
export enum BLOCKS {
  DOCUMENT = 'document',
  PARAGRAPH = 'paragraph',

  HEADING_1 = 'heading-1',
  HEADING_2 = 'heading-2',
  HEADING_3 = 'heading-3',
  HEADING_4 = 'heading-4',
  HEADING_5 = 'heading-5',
  HEADING_6 = 'heading-6',

  OL_LIST = 'ordered-list',
  UL_LIST = 'unordered-list',
  LIST_ITEM = 'list-item',

  HR = 'hr',
  QUOTE = 'blockquote',

  EMBEDDED_ENTRY = 'embedded-entry-block',
  EMBEDDED_ASSET = 'embedded-asset-block',
  EMBEDDED_RESOURCE = 'embedded-resource-block',

  COLUMN = 'column',
  COLUMN_GROUP = 'column-group',

  TABLE = 'table',
  TABLE_ROW = 'table-row',
  TABLE_CELL = 'table-cell',
  TABLE_HEADER_CELL = 'table-header-cell',

  ACCORDION = 'accordion',
  ACCORDION_TITLE = 'accordion-title',
  ACCORDION_BODY = 'accordion-body',

  ASSET_GALLERY = 'asset-gallery',
  IFRAME = 'iframe',
  FILLOUT_FORM = 'fillout'
}
