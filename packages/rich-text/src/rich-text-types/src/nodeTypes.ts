import { BLOCKS } from './blocks';
import { INLINES } from './inlines';
import { Block, Inline, ListItemBlock, Text } from './types';

type EmptyNodeData = {};
// BLOCKS

type Caption = Paragraph | Hr | Heading1 | Heading2 | Heading3 | Heading4  | Heading5 | Heading6;
type Body = Paragraph | Hr | OrderedList | UnorderedList | Heading1 | Heading2 | Heading3 | Heading4  | Heading5 | Heading6;

// Heading
export interface Heading1 extends Block {
  nodeType: BLOCKS.HEADING_1;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading2 extends Block {
  nodeType: BLOCKS.HEADING_2;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading3 extends Block {
  nodeType: BLOCKS.HEADING_3;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading4 extends Block {
  nodeType: BLOCKS.HEADING_4;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading5 extends Block {
  nodeType: BLOCKS.HEADING_5;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

export interface Heading6 extends Block {
  nodeType: BLOCKS.HEADING_6;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// Paragraph
export interface Paragraph extends Block {
  nodeType: BLOCKS.PARAGRAPH;
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// Quote
export interface Quote extends Block {
  nodeType: BLOCKS.QUOTE;
  data: {
    attribution?: string
  };
  content: Paragraph[];
}
// Horizontal rule
export interface Hr extends Block {
  nodeType: BLOCKS.HR;
  /**
   *
   * @maxItems 0
   */
  data: EmptyNodeData;
  content: Array<Inline | Text>;
}

// OL
export interface OrderedList extends Block {
  nodeType: BLOCKS.OL_LIST;
  data: EmptyNodeData;
  content: ListItem[];
}
// UL
export interface UnorderedList extends Block {
  nodeType: BLOCKS.UL_LIST;
  data: EmptyNodeData;
  content: ListItem[];
}

export interface ListItem extends Block {
  nodeType: BLOCKS.LIST_ITEM;
  data: EmptyNodeData;
  content: ListItemBlock[];
}

// taken from graphql schema-generator/contentful-types/link.ts
export interface Link<T extends string = string> {
  sys: {
    type: 'Link';
    linkType: T;
    id: string;
  };
}

export interface ResourceLink {
  sys: {
    type: 'ResourceLink';
    linkType: 'Contentful:Entry';
    urn: string;
  };
}

export interface EntryLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_ENTRY;
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface AssetLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_ASSET;
  data: {
    target: Link<'Asset'>;
    focus?: {x: number, y: number};
    blur?: boolean;
    fit?: string;
    caption?: Array<Caption>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface ResourceLinkBlock extends Block {
  nodeType: BLOCKS.EMBEDDED_RESOURCE;
  data: {
    target: ResourceLink;
  };
  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

// INLINE

export interface EntryLinkInline extends Inline {
  nodeType: INLINES.EMBEDDED_ENTRY;
  data: {
    target: Link<'Entry'>;
  };
  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface AssetLinkInline extends Inline {
  nodeType: INLINES.EMBEDDED_ASSET;
  data: {
    target: Link<'Asset'>;
    float?: string;
    caption?: Array<Caption>;
  };

  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface ResourceLinkInline extends Inline {
  nodeType: INLINES.EMBEDDED_RESOURCE;
  data: {
    target: ResourceLink;
  };

  /**
   *
   * @maxItems 0
   */
  content: Text[];
}

export interface Hyperlink extends Inline {
  nodeType: INLINES.HYPERLINK;
  data: {
    uri: string;
  };
  content: Text[];
}

export interface AssetHyperlink extends Inline {
  nodeType: INLINES.ASSET_HYPERLINK;
  data: {
    target: Link<'Asset'>;
  };
  content: Text[];
}

export interface EntryHyperlink extends Inline {
  nodeType: INLINES.ENTRY_HYPERLINK;
  data: {
    target: Link<'Entry'>;
  };
  content: Text[];
}

export interface ResourceHyperlink extends Inline {
  nodeType: INLINES.RESOURCE_HYPERLINK;
  data: {
    target: ResourceLink;
  };
  content: Text[];
}

export interface Column extends Block {
  nodeType: BLOCKS.COLUMN;
  data: EmptyNodeData;

  /**
   * @minItems 1
   */
  content: Paragraph[];
}

export interface ColumnGroup extends Block {
  nodeType: BLOCKS.COLUMN_GROUP;
  data: {
    layout: number[];
    gap?: string;
    style?: string;
    align?: string;
  };

  /**
   * @minItems 1
   */
  content: Column[];
}

export interface TableCell extends Block {
  nodeType: BLOCKS.TABLE_HEADER_CELL | BLOCKS.TABLE_CELL;
  data: {
    colspan?: number;
    rowspan?: number;
  };

  /**
   * @minItems 1
   */
  content: Paragraph[];
}

export interface TableHeaderCell extends TableCell {
  nodeType: BLOCKS.TABLE_HEADER_CELL;
}

// An abstract table row can have both table cell types

export interface TableRow extends Block {
  nodeType: BLOCKS.TABLE_ROW;
  data: EmptyNodeData;

  /**
   * @minItems 1
   */
  content: TableCell[];
}

export interface Table extends Block {
  nodeType: BLOCKS.TABLE;
  data: EmptyNodeData;

  /**
   * @minItems 1
   */
  content: TableRow[];
}

export interface AccordionTitle extends Block {
  nodeType: BLOCKS.ACCORDION_TITLE;
  data: EmptyNodeData;

  content: Array<Inline | Text>
}

export interface AccordionBody extends Block {
  nodeType: BLOCKS.ACCORDION_BODY;
  data: EmptyNodeData;

  content: Array<Body>
}

export interface Accordion extends Block {
  nodeType: BLOCKS.ACCORDION;
  data: {
    defaultOpen?: boolean;
  };

  /**
   * @minItems 2
   * @maxItems 2
   */
  content: Array<AccordionTitle | AccordionBody>;
}

export interface AssetGallery extends Block {
  nodeType: BLOCKS.ASSET_GALLERY;
  data: {
    title: string;
    slideshow?: boolean;
    collapsible?: boolean;
  };

  /**
   * @minItems 1
   */
  // !HACK: should just be Text | AssetLinkBlock but something isn't working
  content: Array<Text | Block | AssetLinkBlock>;
}

export interface IFrame extends Block {
  nodeType: BLOCKS.IFRAME;
  data: {
    url: string;
    width?: string;
    height?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    }
  };
  /**
   *
   * @maxItems 1
   * @minItems 1
   */
  content: Text[];
}

export interface FilloutForm extends Block {
  nodeType: BLOCKS.FILLOUT_FORM;
  data: {
    id?: string
  };
  /**
   *
   * @maxItems 1
   * @minItems 1
   */
  content: Text[];
}
