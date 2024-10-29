import { isBlockSelected } from '../../helpers/editor';
import {
  withoutNormalizing,
  insertNodes,
  unwrapNodes,
  isElement,
  findNode,
  NodeEntry,
  Node,
  removeNodes,
} from '../../internal';
import { KeyboardHandler, PlateEditor } from '../../internal/types';
import { BLOCKS } from '../../rich-text-types/src';
import { TrackingPluginActions } from '../Tracking';

export function addAssetGallery(
  editor: PlateEditor,
  logAction?: TrackingPluginActions['onShortcutAction'] | TrackingPluginActions['onToolbarAction']
): void {
  if (!editor.selection) return;
  const isActive = isBlockSelected(editor, BLOCKS.ASSET_GALLERY);

  logAction?.(isActive ? 'removeAssetGallery' : 'insertAssetGallery', { nodeType: BLOCKS.ASSET_GALLERY });

  withoutNormalizing(editor, () => {
    if (!editor.selection) return;

    unwrapNodes(editor, {
      match: (node) => isElement(node) && node.type === BLOCKS.ASSET_GALLERY,
      split: false
    });

    if (!isActive) {
      const gallery = {
        type: BLOCKS.ASSET_GALLERY,
        data: {title: ''},
        children: [{ text: '' }],
      };

      insertNodes(editor, gallery);
    }
  });
}

export const onKeyDownAddAssetGallery: KeyboardHandler = (editor) => (event) => {
  const { selection } = editor;

  // if selection is last embedded asset remove it manually.
  // This prevents the entire gallery from being deleted.
  if (event.key === 'Backspace') {
    if (!selection) return;
    const assetActive = isBlockSelected(editor, BLOCKS.EMBEDDED_ASSET);
    const galleryNode = findNode(editor, {at: selection, match: {type: BLOCKS.ASSET_GALLERY}}) as NodeEntry;

    if (assetActive && galleryNode) {
      const children = (galleryNode[0]?.children) as Array<Node>;

      if (children.length == 1) {
        removeNodes(editor, {at: selection, match: (n) => n.type == BLOCKS.EMBEDDED_ASSET});
        // TODO: trying to put focus back on the gallery but its not working
        // select(editor, [...galleryNode[1], 0])
      }
    }
  }
};
