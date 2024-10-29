import React, { useState } from 'react';


import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { isLinkActive } from '../../helpers/editor';
import { isNodeTypeEnabled } from '../../helpers/validations';
import { EmbeddedBlockToolbarIcon } from '../../plugins/shared/EmbeddedBlockToolbarIcon';
import { EmbeddedInlineToolbarIcon } from '../../plugins/shared/EmbeddedInlineToolbarIcon';
import { BLOCKS, INLINES } from '../../rich-text-types/src';
import { useSdkContext } from '../../SdkProvider';
import { EmbeddedEntityDropdownButton } from './EmbeddedEntityDropdownButton';

export interface EmbedEntityWidgetProps {
  isDisabled?: boolean;
  canInsertBlocks?: boolean;
  restrictedBlocks?: string[];
}

export const EmbedEntityWidget = ({ isDisabled, canInsertBlocks, restrictedBlocks }: EmbedEntityWidgetProps) => {
  const sdk = useSdkContext();
  const editor = useContentfulEditor();

  const [isEmbedDropdownOpen, setEmbedDropdownOpen] = useState(false);
  const onCloseEntityDropdown = () => setEmbedDropdownOpen(false);
  const onToggleEntityDropdown = () => setEmbedDropdownOpen(!isEmbedDropdownOpen);

  const inlineAssetEmbedEnabled = isNodeTypeEnabled(sdk.field, INLINES.EMBEDDED_ASSET, restrictedBlocks);
  const inlineEntryEmbedEnabled = isNodeTypeEnabled(sdk.field, INLINES.EMBEDDED_ENTRY, restrictedBlocks);
  const inlineResourceEmbedEnabled = isNodeTypeEnabled(sdk.field, INLINES.EMBEDDED_RESOURCE, restrictedBlocks);
  const blockEntryEmbedEnabled =
    isNodeTypeEnabled(sdk.field, BLOCKS.EMBEDDED_ENTRY, restrictedBlocks) && canInsertBlocks;
  const blockResourceEmbedEnabled =
    isNodeTypeEnabled(sdk.field, BLOCKS.EMBEDDED_RESOURCE, restrictedBlocks) && canInsertBlocks;
  // Removed access check following https://contentful.atlassian.net/browse/DANTE-486
  // TODO: refine permissions check in order to account for tags in rules and then readd access.can('read', 'Asset')
  const blockAssetEmbedEnabled =
    isNodeTypeEnabled(sdk.field, BLOCKS.EMBEDDED_ASSET, restrictedBlocks) && canInsertBlocks;

  const actions = (
    <>
      {blockEntryEmbedEnabled && (
        <EmbeddedBlockToolbarIcon
          isDisabled={!!isDisabled}
          nodeType={BLOCKS.EMBEDDED_ENTRY}
          onClose={onCloseEntityDropdown}
        />
      )}
      {blockResourceEmbedEnabled && (
        <EmbeddedBlockToolbarIcon
          isDisabled={!!isDisabled}
          nodeType={BLOCKS.EMBEDDED_RESOURCE}
          onClose={onCloseEntityDropdown}
        />
      )}
      {inlineEntryEmbedEnabled && (
        <EmbeddedInlineToolbarIcon
          nodeType={INLINES.EMBEDDED_ENTRY}
          isDisabled={!!isDisabled || isLinkActive(editor)}
          onClose={onCloseEntityDropdown}
        />
      )}
      {inlineResourceEmbedEnabled && (
        <EmbeddedInlineToolbarIcon
          nodeType={INLINES.EMBEDDED_RESOURCE}
          isDisabled={!!isDisabled || isLinkActive(editor)}
          onClose={onCloseEntityDropdown}
        />
      )}
      {blockAssetEmbedEnabled && (
        <EmbeddedBlockToolbarIcon
          isDisabled={!!isDisabled}
          nodeType={BLOCKS.EMBEDDED_ASSET}
          onClose={onCloseEntityDropdown}
        />
      )}
      {inlineAssetEmbedEnabled && (
        <EmbeddedInlineToolbarIcon
          nodeType={INLINES.EMBEDDED_ASSET}
          isDisabled={!!isDisabled || isLinkActive(editor)}
          onClose={onCloseEntityDropdown}
        />
      )}
    </>
  );

  const showEmbedButton =
    blockEntryEmbedEnabled ||
    blockResourceEmbedEnabled ||
    inlineEntryEmbedEnabled ||
    inlineResourceEmbedEnabled ||
    blockAssetEmbedEnabled ||
    inlineAssetEmbedEnabled;

  return showEmbedButton ? (
    <EmbeddedEntityDropdownButton
      isDisabled={isDisabled}
      onClose={onCloseEntityDropdown}
      onToggle={onToggleEntityDropdown}
      isOpen={isEmbedDropdownOpen}
    >
      {actions}
    </EmbeddedEntityDropdownButton>
  ) : null;
};
