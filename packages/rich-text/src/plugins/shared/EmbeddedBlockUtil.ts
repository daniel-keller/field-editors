import { FieldAppSDK } from '@contentful/app-sdk';
import { HotkeyPlugin } from '@udecode/plate-common';
import isHotkey from 'is-hotkey';

import {
  newEntitySelectorConfigFromRichTextField,
  newResourceEntitySelectorConfigFromRichTextField,
} from '../../helpers/config';
import {
  focus,
  getNodeEntryFromSelection,
  insertEmptyParagraph,
  moveToTheNextChar,
} from '../../helpers/editor';
import { watchCurrentSlide } from '../../helpers/sdkNavigatorSlideIn';
import {
  getText,
  getAboveNode,
  getLastNodeByLevel,
  insertNodes,
  PlateEditor,
  setNodes,
  select,
  KeyboardHandler,
  removeNodes,
  getChildren,
  NodeEntry,
  // getLastChildPath,
} from '../../internal';
import { TEXT_CONTAINERS, BLOCKS, VOID_BLOCKS, Text, Block, Inline } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';


const getLink = (entity) => {
  return {
    sys: {
      id: entity.sys.id,
      type: 'Link',
      linkType: entity.sys.type,
    },
  };
};

const createNode = (nodeType, entity) => {
  return {
    type: nodeType,
    data: {
      target: nodeType === BLOCKS.EMBEDDED_RESOURCE ? entity : getLink(entity),
    },
    children: [{ text: '' }],
    isVoid: true,
  };
};

export function getWithEmbeddedBlockEvents(
  nodeType: BLOCKS.EMBEDDED_ENTRY | BLOCKS.EMBEDDED_ASSET | BLOCKS.EMBEDDED_RESOURCE,
  sdk: FieldAppSDK
): KeyboardHandler<HotkeyPlugin> {
  return (editor, { options: { hotkey } }) =>
    (event) => {
      const [element, pathToSelectedElement] = getNodeEntryFromSelection(editor, nodeType);
      const children = getChildren([element, pathToSelectedElement] as NodeEntry);

      if (pathToSelectedElement) {
        const isDelete = event.key === 'Delete';
        const isBackspace = event.key === 'Backspace';

        if ((isDelete || isBackspace) && children.length <= 0) {
          event.preventDefault();
          removeNodes(editor, { at: pathToSelectedElement });
        }

        return;
      }

      if (hotkey && isHotkey(hotkey, event)) {
        if (nodeType === BLOCKS.EMBEDDED_RESOURCE) {
          selectResourceEntityAndInsert(sdk, editor, editor.tracking.onShortcutAction);
        } else {
          selectEntityAndInsert(nodeType, sdk, editor, editor.tracking.onShortcutAction);
        }
      }
    };
}

export async function selectEntityAndInsert(
  nodeType,
  sdk,
  editor,
  logAction: TrackingPluginActions['onToolbarAction'] | TrackingPluginActions['onShortcutAction'],
  selectManyAndReturn: boolean = false,
) {
  logAction('openCreateEmbedDialog', { nodeType });

  const { field, dialogs } = sdk;
  const baseConfig = newEntitySelectorConfigFromRichTextField(field, nodeType);

  const selectEntity = baseConfig.entityType === 'Asset'
    ? selectManyAndReturn
      ? dialogs.selectMultipleAssets
      : dialogs.selectSingleAsset
    : dialogs.selectSingleEntry;


  const config = { ...baseConfig, withCreate: true };

  const { selection } = editor;
  const rteSlide = watchCurrentSlide(sdk.navigator);
  const entity = await selectEntity(config);

  if (!entity) {
    logAction('cancelCreateEmbedDialog', { nodeType });
    if (selectManyAndReturn) return null;
  } else {
    if (selectManyAndReturn) {
      let entities: any[] = entity;
      if (!Array.isArray(entity)) entities = [entity];
      return entities.map(e => createNode(nodeType, e));
    }
    // Selection prevents incorrect position of inserted ref when RTE doesn't have focus
    // (i.e. when using hotkeys and slide-in)
    select(editor, selection);
    insertBlock(editor, nodeType, entity);
    ensureFollowingParagraph(editor, [BLOCKS.EMBEDDED_ASSET, BLOCKS.EMBEDDED_ENTRY]);
    logAction('insert', { nodeType });
  }
  // If user chose to create a new entity, this might open slide-in to edit the
  // entity. In this case, no point in focusing RTE which is now in the slide below.
  rteSlide.onActive(() => {
    rteSlide.unwatch();
    focus(editor);
  });
}

/**
 * return true if node contains all empty space
 */
export function isEmptyNode (nodes?: Array<Block | Inline | Text>) {
  if (!nodes) return true;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (VOID_BLOCKS.includes(node.nodeType as any)) return false;
    if (node.nodeType == 'text' && node.value.trim() != '') return false;
    if (node.nodeType != 'text') return isEmptyNode(node.content);
  }
  return true;
}


export async function selectResourceEntityAndInsert(
  sdk,
  editor,
  logAction: TrackingPluginActions['onToolbarAction'] | TrackingPluginActions['onShortcutAction']
) {
  logAction('openCreateEmbedDialog', { nodeType: BLOCKS.EMBEDDED_RESOURCE });

  const { field, dialogs } = sdk;
  const config = newResourceEntitySelectorConfigFromRichTextField(field, BLOCKS.EMBEDDED_RESOURCE);

  const { selection } = editor;

  const entityLink = await dialogs.selectSingleResourceEntity(config);

  if (!entityLink) {
    logAction('cancelCreateEmbedDialog', { nodeType: BLOCKS.EMBEDDED_RESOURCE });
  } else {
    // Selection prevents incorrect position of inserted ref when RTE doesn't have focus
    // (i.e. when using hotkeys and slide-in)
    select(editor, selection);
    insertBlock(editor, BLOCKS.EMBEDDED_RESOURCE, entityLink);
    ensureFollowingParagraph(editor, [BLOCKS.EMBEDDED_RESOURCE]);
    logAction('insert', { nodeType: BLOCKS.EMBEDDED_RESOURCE });
  }
}

// TODO: incorporate this logic inside the trailingParagraph plugin instead
function ensureFollowingParagraph(editor: PlateEditor, nodeTypes: BLOCKS[]) {
  const entityBlock = getAboveNode(editor, {
    match: {
      type: nodeTypes,
    },
  });

  if (!entityBlock) {
    return;
  }

  const level = entityBlock[1].length - 1;
  const lastNode = getLastNodeByLevel(editor, level);

  const isTextContainer = (TEXT_CONTAINERS as string[]).includes(
    (lastNode?.[0].type ?? '') as string
  );

  // If the new block isn't followed by a sibling text container (e.g. paragraph)
  // we insert a new empty one. Level 0 is handled by the trailingParagraph plugin
  if (level !== 0 && !isTextContainer) {
    insertEmptyParagraph(editor);
  }

  moveToTheNextChar(editor);
}

// TODO: DRY up copied code from HR
function insertBlock(editor: PlateEditor, nodeType: string, entity) {
  if (!editor?.selection) return;

  const linkedEntityBlock = createNode(nodeType, entity);

  const hasText = editor.selection && !!getText(editor, editor.selection.focus.path);

  if (hasText) {
    insertNodes(editor, linkedEntityBlock);
  } else {
    setNodes(editor, linkedEntityBlock);
  }
}
