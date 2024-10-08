import { FieldAppSDK } from '@contentful/app-sdk';
import { HotkeyPlugin } from '@udecode/plate-common';
import isHotkey from 'is-hotkey';

import {
  newEntitySelectorConfigFromRichTextField,
  newResourceEntitySelectorConfigFromRichTextField,
} from '../../helpers/config';
import { focus } from '../../helpers/editor';
import { watchCurrentSlide } from '../../helpers/sdkNavigatorSlideIn';
import { insertNodes, select } from '../../internal/transforms';
import { KeyboardHandler } from '../../internal/types';
import { TrackingPluginActions } from '../../plugins/Tracking';
import { INLINES } from '../../rich-text-types/src';

export function getWithEmbeddedEntryInlineEvents(
  nodeType: INLINES.EMBEDDED_ENTRY | INLINES.EMBEDDED_ASSET | INLINES.EMBEDDED_RESOURCE,
  sdk: FieldAppSDK
): KeyboardHandler<HotkeyPlugin> {
  return function withEmbeddedEntryInlineEvents(editor, { options: { hotkey } }) {
    return function handleEvent(event) {
      if (!editor) return;

      if (hotkey && isHotkey(hotkey, event)) {
        if (nodeType === INLINES.EMBEDDED_RESOURCE) {
          selectResourceEntityAndInsert(editor, sdk, editor.tracking.onShortcutAction);
        } else {
          selectEntityAndInsert(nodeType, editor, sdk, editor.tracking.onShortcutAction);
        }
      }
    };
  };
}

const getLink = (entity) => {
  return {
    sys: {
      id: entity.sys.id,
      type: 'Link',
      linkType: entity.sys.type,
    },
  };
};

const createInlineEntryNode = (nodeType, entity) => {
  const data = {
    target: nodeType === INLINES.EMBEDDED_RESOURCE ? entity : getLink(entity),
  };

  if (nodeType === INLINES.EMBEDDED_ASSET) {
    data['float'] = 'left';
  }

  return {
    type: nodeType,
    children: [{ text: '' }],
    data: data,
  };
};

export async function selectEntityAndInsert(
  nodeType,
  editor,
  sdk,
  logAction: TrackingPluginActions['onShortcutAction'] | TrackingPluginActions['onToolbarAction']
) {
  logAction('openCreateEmbedDialog', { nodeType });

  const { field, dialogs } = sdk;
  const baseConfig = newEntitySelectorConfigFromRichTextField(field, nodeType);
  const selectEntity =
    baseConfig.entityType === 'Asset' ? dialogs.selectSingleAsset : dialogs.selectSingleEntry;
  const config = { ...baseConfig, withCreate: true };

  const { selection } = editor;
  const rteSlide = watchCurrentSlide(sdk.navigator);
  const entity = await selectEntity(config);

  if (!entity) {
    logAction('cancelCreateEmbedDialog', { nodeType });
  } else {
    // Selection prevents incorrect position of inserted ref when RTE doesn't have focus
    // (i.e. when using hotkeys and slide-in)
    select(editor, selection);
    insertNodes(editor, createInlineEntryNode(nodeType, entity));
    logAction('insert', { nodeType });
  }
  rteSlide.onActive(() => {
    rteSlide.unwatch();
    focus(editor);
  });
}

export async function selectResourceEntityAndInsert(
  editor,
  sdk,
  logAction: TrackingPluginActions['onToolbarAction'] | TrackingPluginActions['onShortcutAction']
) {
  const nodeType = INLINES.EMBEDDED_RESOURCE;
  logAction('openCreateEmbedDialog', { nodeType });

  const { dialogs, field } = sdk;
  const config = {
    ...newResourceEntitySelectorConfigFromRichTextField(field, nodeType),
    withCreate: true,
  };

  const { selection } = editor;
  const entryLink = await dialogs.selectSingleResourceEntity(config);

  if (!entryLink) {
    logAction('cancelCreateEmbedDialog', { nodeType });
  } else {
    // Selection prevents incorrect position of inserted ref when RTE doesn't have focus
    // (i.e. when using hotkeys and slide-in)
    select(editor, selection);
    insertNodes(editor, createInlineEntryNode(nodeType, entryLink));
    logAction('insert', { nodeType });
  }
}
