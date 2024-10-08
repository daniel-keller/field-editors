import * as React from 'react';

import { EntityLink } from '@contentful/field-editor-reference';
import { css } from 'emotion';
import { useReadOnly, useSelected } from 'slate-react';

import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { findNodePath, getChildren, getText } from '../../internal/queries';
import { removeNodes } from '../../internal/transforms';
import { Element, NodeEntry, RenderElementProps } from '../../internal/types';
import { useSdkContext } from '../../SdkProvider';
import { useLinkTracking } from '../links-tracking';
import { FetchingWrappedAssetCard } from '../shared/FetchingWrappedAssetCard';
import { FetchingWrappedEntryCard } from '../shared/FetchingWrappedEntryCard';
import { LinkedBlockWrapper } from '../shared/LinkedBlockWrapper';
import { IconButton, Stack, ToggleButton } from '@contentful/f36-components';
import { BLOCKS } from 'rich-text-types/src';
import { getNodeEntryFromSelection } from '../../helpers/editor';

type LinkedEntityBlockProps = {
  element: Element & {
    data: {
      target: EntityLink;
    };
  };
  attributes: Pick<RenderElementProps, 'attributes'>;
  children: React.ReactNode;
};

const wrapperStyles = {
  'text-align': 'center',
  borderRadius: '5px',
  backgroundImage: `linear-gradient(
    45deg,
    #f2f2f2 25%,
    #e3e3e3 25%,
    #e3e3e3 50%,
    #f2f2f2 50%,
    #f2f2f2 75%,
    #e3e3e3 75%,
    #e3e3e3 100%
  )`,
  backgroundSize: '20px 20px',
  padding: '15px',
};

const wrapper = css(wrapperStyles);
const assetWrapper = css({
  ...wrapperStyles,
  borderBottomLeftRadius: '0px',
  borderBottomRightRadius: '0px'
});

const toggle = css`
  padding: 0.25rem 0.25rem;
`;

const caption = css`
  background-color: #e3e3e3;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 6px;
  padding: 5px;
  & #caption-header {
    border-bottom: 1px solid grey;
    margin-bottom: 5px;
  }
`;

const addCaptionWrapper = css `
  position: relative;
`;

const addCaption = css`
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  background-color: #e3e3e3;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 6px;
  padding-left: 10px;
  padding-right: 10px;
`;

export function LinkedEntityBlock(props: LinkedEntityBlockProps) {
  const { attributes, children, element } = props;
  const { onEntityFetchComplete } = useLinkTracking();
  const isSelected = useSelected();
  const editor = useContentfulEditor();
  const sdk = useSdkContext();
  const isDisabled = useReadOnly();
  const { id: entityId, linkType: entityType } = element.data.target.sys;

  const handleEditClick = React.useCallback(() => {
    const openEntity = entityType === 'Asset' ? sdk.navigator.openAsset : sdk.navigator.openEntry;
    return openEntity(entityId, { slideIn: true });
  }, [sdk, entityId, entityType]);

  const handleRemoveClick = React.useCallback(() => {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    removeNodes(editor, { at: pathToElement });
  }, [editor, element]);

  const showCaption = React.useCallback(() => {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    if (pathToElement) {
      // Show caption is node is selected
      const [element, pathToSelectedElement] = getNodeEntryFromSelection(editor, BLOCKS.EMBEDDED_ASSET);
      const children = getChildren([element, pathToSelectedElement] as NodeEntry);

      // or if text in node is not empty
      const currentText = getText(editor, pathToElement);
      return currentText.trim() != '' || children.length != 0;
    }
    return false;
  }, [editor, element]);

  const test = React.useCallback(() => {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    if (pathToElement) {
      // Show caption is node is selected
      const children = getChildren([element, pathToElement] as NodeEntry);

      // or if text in node is not empty
      console.log(children);
    }
  }, [editor, element]);

  if (entityType === 'Entry') {
    return (
      <LinkedBlockWrapper
        attributes={attributes}
        card={
          <div className={wrapper}>
            <FetchingWrappedEntryCard
              sdk={sdk}
              entryId={entityId}
              locale={sdk.field.locale}
              isDisabled={isDisabled}
              isSelected={isSelected}
              onRemove={handleRemoveClick}
              onEdit={handleEditClick}
              onEntityFetchComplete={onEntityFetchComplete}
            />
          </div>
        }
        link={element.data.target}
      >
        {children}
      </LinkedBlockWrapper>
    );
  }


  return (
    <LinkedBlockWrapper
      attributes={attributes}
      card={
        <div className={assetWrapper}>
            <>
              <Stack flexDirection='row' justifyContent='center'>
                <Stack flexDirection='column'>
                  <IconButton
                    aria-label='set focal point'
                    size='small'
                    variant='secondary'
                    icon={<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fillRule="nonzero" d="M13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2zm-1 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"></path> </g> </g></svg>}
                    onClick={test}
                  />
                  <ToggleButton
                    className={toggle}
                    aria-label='blur background'
                    size='small'
                    icon={<svg width="24px" height="24px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.336"></g><g id="SVGRepo_iconCarrier"> <path d="M5.99988 16.938V19.059L5.05851 20H2.93851L5.99988 16.938ZM22.0015 14.435V16.557L18.5595 20H17.9935L17.9939 18.443L22.0015 14.435ZM8.74988 14H15.2446C16.1628 14 16.9158 14.7071 16.9888 15.6065L16.9946 15.75V20H15.4946V15.75C15.4946 15.6317 15.4124 15.5325 15.3019 15.5066L15.2446 15.5H8.74988C8.63154 15.5 8.5324 15.5822 8.50648 15.6927L8.49988 15.75V20H6.99988V15.75C6.99988 14.8318 7.70699 14.0788 8.60636 14.0058L8.74988 14ZM8.02118 10.4158C8.08088 10.9945 8.26398 11.5367 8.54372 12.0154L1.99951 18.56V16.438L8.02118 10.4158ZM22.0015 9.932V12.055L17.9939 16.065L17.9946 15.75L17.9896 15.5825C17.9623 15.128 17.8246 14.7033 17.6029 14.3348L22.0015 9.932ZM12.0565 4L1.99951 14.06V11.939L9.93551 4H12.0565ZM22.0015 5.432V7.555L16.3346 13.2245C16.0672 13.1089 15.7779 13.0346 15.4746 13.0095L15.2446 13L14.6456 13.0005C14.9874 12.6989 15.2772 12.3398 15.4999 11.9384L22.0015 5.432ZM11.9999 7.00046C13.6567 7.00046 14.9999 8.34361 14.9999 10.0005C14.9999 11.6573 13.6567 13.0005 11.9999 13.0005C10.343 13.0005 8.99988 11.6573 8.99988 10.0005C8.99988 8.34361 10.343 7.00046 11.9999 7.00046ZM11.9999 8.50046C11.1715 8.50046 10.4999 9.17203 10.4999 10.0005C10.4999 10.8289 11.1715 11.5005 11.9999 11.5005C12.8283 11.5005 13.4999 10.8289 13.4999 10.0005C13.4999 9.17203 12.8283 8.50046 11.9999 8.50046ZM7.55851 4L1.99951 9.56V7.438L5.43751 4H7.55851ZM21.0565 4L15.9091 9.14895C15.7923 8.61022 15.5669 8.11194 15.2571 7.67816L18.9345 4H21.0565ZM16.5585 4L14.0148 6.54427C13.5362 6.26463 12.9942 6.08157 12.4157 6.02181L14.4365 4H16.5585Z" fill="#212121"></path> </g></svg>}
                    onToggle={() => {}}
                  />
                </Stack>

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
              </Stack>
            </>
        </div>
      }
      link={element.data.target}
    >
      {showCaption() && <div className={caption}>
        <div id='caption-header' contentEditable={false}>Caption</div>
        {children}
      </div>}

      {!showCaption() && <div className={addCaptionWrapper}>
        <div contentEditable={false} className={addCaption}>
          Add Caption
        </div>
        {children}
      </div>}
    </LinkedBlockWrapper>
  );
}
