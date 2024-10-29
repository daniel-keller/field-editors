import * as React from 'react';

import { ButtonGroup, Stack, Tooltip, IconButton, ToggleButton } from '@contentful/f36-components';
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
import { setRichTextCaption } from '../shared/RichTextCaptionDialog';
import { TopLevelBlock } from '../../rich-text-types/src';
import { isEmptyNode } from '../shared/EmbeddedBlockUtil';

type LinkedEntityInlineProps = {
  element: Element & {
    data: {
      target: EntityLink;
      float?: string;
      caption?: TopLevelBlock[];
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
        isActive={float == 'left'}
        icon={<ArrowBackwardIcon />}
        aria-label="Float Left"
        size="small"
        onToggle={() => {
          onToggle('left');
        }}
      />
      <ToggleButton
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
  const { float, caption, target } = element.data;
  const { id: entityId, linkType: entityType } = target.sys;

  const handleEditClick = React.useCallback(() => {
    const openEntity = entityType === 'Asset' ? sdk.navigator.openAsset : sdk.navigator.openEntry;
    return openEntity(entityId, { slideIn: true }).then(() => editor && focus(editor));
  }, [sdk, entityId, entityType, editor]);

  const handleRemoveClick = React.useCallback(() => {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    removeNodes(editor, { at: pathToElement });
  }, [editor, element]);

  function toggleFloat(flt: string) {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    setNodes(editor, { data: { ...element.data, float: flt } }, { at: pathToElement });
  }

  // set caption
  const setCaption = React.useCallback(async () => {
    const value = await setRichTextCaption(sdk, caption) as TopLevelBlock[] | undefined;
    const path = findNodePath(editor, element);
    const isEmpty = isEmptyNode(value);
    setNodes(editor, {data: {...element.data, caption: isEmpty ? undefined : value}}, { at: path });
  }, [editor, element, caption, sdk]);

  const hasCaption = React.useMemo(() => {
    return !isEmptyNode(caption);
  }, [caption])

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
        link={target}
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
        className={float == 'left' ? styles.inlineAssetLeft : styles.inlineAssetRight}
        flexDirection="column"
        spacing="spacingXs"
      >
        <Stack
          flexDirection='row'
          justifyContent='center'
          className={css`position: relative; z-index: 1;`}
        >
          <ToggleFloatButtons onToggle={toggleFloat} float={float ?? 'right'} />
          {/* Caption */}
          <Tooltip placement="right"
            id="tooltip-caption"
            content='Edit caption'
          >
            <ToggleButton
              isActive={hasCaption}
              aria-label='edit caption'
              size='small'
              icon={<svg width="24px" height="24px" fill="#000000" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M128,20A108,108,0,1,0,236,128,108.12217,108.12217,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.0953,84.0953,0,0,1,128,212Zm41.59473-52.79a51.99951,51.99951,0,1,1,0-62.43066,12.0004,12.0004,0,0,1-19.1875,14.418,28.00025,28.00025,0,1,0,0,33.59521A12.00025,12.00025,0,0,1,169.59473,159.21Z"></path> </g></svg>}
              onToggle={setCaption}
            />
          </Tooltip>
        </Stack>
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
          link={target}
        >
          {children}
        </LinkedInlineWrapper>
      </Stack>
    </>
  );
}
