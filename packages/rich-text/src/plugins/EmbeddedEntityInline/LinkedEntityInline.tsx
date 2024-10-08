import * as React from 'react';

import { ButtonGroup, Stack, IconButton, ToggleButton } from '@contentful/f36-components';
import { ArrowBackwardIcon, ArrowForwardIcon } from '@contentful/f36-icons';
import { EntityLink } from '@contentful/field-editor-reference';
import { css } from 'emotion';
import { useReadOnly, useSelected } from 'slate-react';

import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { focus } from '../../helpers/editor';
import { findNodePath } from '../../internal/queries';
import { removeNodes, setNodes } from '../../internal/transforms';
import { Element, RenderElementProps } from '../../internal/types';
import { useSdkContext } from '../../SdkProvider';
import { useLinkTracking } from '../links-tracking';
import { FetchingWrappedAssetCard } from '../shared/FetchingWrappedAssetCard';
import { LinkedInlineWrapper } from '../shared/LinkedInlineWrapper';
import { FetchingWrappedInlineEntryCard } from './FetchingWrappedInlineEntryCard';

type LinkedEntityInlineProps = {
  element: Element & {
    data: {
      target: EntityLink;
      float?: string;
    };
  };
  attributes: Pick<RenderElementProps, 'attributes'>;
  children: React.ReactNode;
};

const styles = {
  inlineAssetAnchor: css({
    minHeight: 0,
    marginRight: '2px',
    marginLeft: '2px',
  }),
  inlineAssetRight: css({
    marginTop: '10px',
    paddingLeft: '10px',
    float: 'right',
  }),
  inlineAssetLeft: css({
    marginTop: '10px',
    paddingRight: '10px',
    float: 'left',
  }),
  extraSmallButtons: css({
    minHeight: 'unset',
    height: 'fit-content',
    padding: '0.15rem 0.5rem',
  }),
};

function ToggleFloatButtons({
  float,
  onToggle,
}: {
  float: string;
  onToggle: (float: string) => void;
}) {
  return (
    <ButtonGroup>
      <ToggleButton
        className={styles.extraSmallButtons}
        isActive={float == 'left'}
        icon={<ArrowBackwardIcon />}
        aria-label="Float Left"
        size="small"
        onToggle={() => {
          onToggle('left');
        }}
      />
      <ToggleButton
        className={styles.extraSmallButtons}
        isActive={float == 'right'}
        icon={<ArrowForwardIcon />}
        aria-label="Float Right"
        size="small"
        onToggle={() => {
          onToggle('right');
        }}
      />
    </ButtonGroup>
  );
}

export function LinkedEntityInline(props: LinkedEntityInlineProps) {
  const { attributes, children, element } = props;
  const { onEntityFetchComplete } = useLinkTracking();
  const isSelected = useSelected();
  const editor = useContentfulEditor();
  const sdk = useSdkContext();
  const isDisabled = useReadOnly();
  const { id: entityId, linkType: entityType } = element.data.target.sys;

  const handleEditClick = React.useCallback(() => {
    const openEntity = entityType === 'Asset' ? sdk.navigator.openAsset : sdk.navigator.openEntry;
    return openEntity(entityId, { slideIn: true }).then(() => editor && focus(editor));
  }, [sdk, entityId, entityType, editor]);

  const handleRemoveClick = React.useCallback(() => {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    removeNodes(editor, { at: pathToElement });
  }, [editor, element]);

  function toggleFloat(float: string) {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    setNodes(editor, { data: { ...element.data, float: float } }, { at: pathToElement });
  }

  if (entityType === 'Entry') {
    return (
      <LinkedInlineWrapper
        attributes={attributes}
        card={
          <FetchingWrappedInlineEntryCard
            sdk={sdk}
            entryId={entityId}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onRemove={handleRemoveClick}
            onEdit={handleEditClick}
            onEntityFetchComplete={onEntityFetchComplete}
          />
        }
        link={element.data.target}
      >
        {children}
      </LinkedInlineWrapper>
    );
  }

  function selectImage() {
    if (!editor && !isSelected) return;
    const pathToElement = findNodePath(editor, element);
    if (pathToElement) {
      editor.select(pathToElement);
    }
  }

  // Inline Asset
  return (
    <>
      <IconButton
        size="small"
        variant="secondary"
        className={styles.inlineAssetAnchor}
        aria-label="inline asset location"
        onClick={selectImage}
        icon={
          <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8.4C13.4912 8.4 14.7 7.19117 14.7 5.7C14.7 4.20883 13.4912 3 12 3C10.5088 3 9.3 4.20883 9.3 5.7C9.3 7.19117 10.5088 8.4 12 8.4ZM12 8.4V20.9999M12 20.9999C9.61305 20.9999 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12H5M12 20.9999C14.3869 20.9999 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12H19"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
      <Stack
        className={element.data.float == 'left' ? styles.inlineAssetLeft : styles.inlineAssetRight}
        flexDirection="column"
        spacing="spacingXs"
      >
        <ToggleFloatButtons onToggle={toggleFloat} float={element.data.float ?? 'right'} />
        <LinkedInlineWrapper
          attributes={attributes}
          card={
            <FetchingWrappedAssetCard
              sdk={sdk}
              assetId={entityId}
              locale={sdk.field.locale}
              isDisabled={isDisabled}
              isSelected={isSelected}
              onRemove={handleRemoveClick}
              onEdit={handleEditClick}
              onEntityFetchComplete={onEntityFetchComplete}
            />
          }
          link={element.data.target}
        >
          {children}
        </LinkedInlineWrapper>
      </Stack>
    </>
  );
}
