import * as React from 'react';

import { Asset } from '@contentful/app-sdk';
import { IconButton, Stack, ToggleButton, Tooltip } from '@contentful/f36-components';
import { EntityLink } from '@contentful/field-editor-reference';
import { css } from 'emotion';
import { useReadOnly, useSelected } from 'slate-react';

import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { findNodePath, isEditorReadOnly } from '../../internal/queries';
import { removeNodes, setNodes } from '../../internal/transforms';
import { Element, RenderElementProps } from '../../internal/types';
import { useSdkContext } from '../../SdkProvider';
import { useLinkTracking } from '../links-tracking';
import { FetchingWrappedAssetCard } from '../shared/FetchingWrappedAssetCard';
import { FetchingWrappedEntryCard } from '../shared/FetchingWrappedEntryCard';
import { LinkedBlockWrapper } from '../shared/LinkedBlockWrapper';
import { setFocalPointForAsset, Point } from '../../focal-point-picker/components/FocalPointDialog';
import { setRichTextCaption } from '../shared/RichTextCaptionDialog';
import { TopLevelBlock } from '../../rich-text-types/src';
import { isEmptyNode } from '../shared/EmbeddedBlockUtil';

type LinkedEntityBlockProps = {
  element: Element & {
    data: {
      target: EntityLink;
      focus?: Point;
      blur?: string;
      fit?: string;
      caption?: TopLevelBlock[];
    };
  };
  attributes: Pick<RenderElementProps, 'attributes'>;
  children: React.ReactNode;
};

const toggle = css`
  padding: 0.25rem 0.25rem;
`;

const wrapperBlur = css`
  backdrop-filter: blur(10px);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
`;

export function LinkedEntityBlock(props: LinkedEntityBlockProps) {
  const { attributes, element } = props;
  const { onEntityFetchComplete } = useLinkTracking();
  const isSelected = useSelected();
  const editor = useContentfulEditor();
  const isReadOnly = isEditorReadOnly(editor);
  const sdk = useSdkContext();
  const isDisabled = useReadOnly();
  const { id: entityId, linkType: entityType } = element.data.target.sys;
  const { focus, blur, fit, caption } = element.data;

  const [point, setPoint] = React.useState<Point | undefined>(focus as Point | undefined);
  const [loadedAsset, setLoadedAsset] = React.useState<Asset | null>();
  const [imageFitCover, setImageFitCover] = React.useState<boolean>(fit == 'cover');
  const [blurBackground, setBlurBackground] = React.useState<boolean>(!!blur);

  // Edit entry/asset
  const handleEditClick = React.useCallback(() => {
    const openEntity = entityType === 'Asset' ? sdk.navigator.openAsset : sdk.navigator.openEntry;
    return openEntity(entityId, { slideIn: true });
  }, [sdk, entityId, entityType]);

  // Update node data
  const updateFit = React.useCallback((fitIsCover: boolean) => {
    if (!editor) return;
    const path = findNodePath(editor, element);
    const fit = fitIsCover ? 'cover' : undefined;
    const blur = !fitIsCover && blurBackground ? true : undefined;
    const focus = fitIsCover && point ? point : undefined;

    setNodes(editor, {data: {...element.data, fit, blur, focus }}, { at: path });
    setImageFitCover(fitIsCover);
  }, [editor, element, point, blurBackground]);

  const updateBlur = React.useCallback((imageBlur: boolean) => {
    if (!editor) return;
    const path = findNodePath(editor, element);
    const blur = !imageFitCover && imageBlur ? true : undefined;
    setNodes(editor, {data: {...element.data, blur}}, { at: path });
    setBlurBackground(imageBlur);
  }, [imageFitCover, editor, element]);

  const updateFocus = React.useCallback((imageFocus?: Point) => {
    if (!editor) return;
    const path = findNodePath(editor, element);
    const focus = imageFitCover && imageFocus ? imageFocus : undefined;
    setNodes(editor, {data: {...element.data, focus}}, { at: path });
  }, [imageFitCover, editor, element]);


  // Remove
  const handleRemoveClick = React.useCallback(() => {
    if (!editor) return;
    const pathToElement = findNodePath(editor, element);
    removeNodes(editor, { at: pathToElement });
  }, [editor, element]);

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

  /**
   * Open FocalPoint dialog after if asset is loaded
   */
  const openFocalPoint = React.useCallback(async () => {
    if (loadedAsset) {
      const focus = await setFocalPointForAsset(sdk, loadedAsset, point) as Point | undefined;
      setPoint(focus);
      updateFocus(focus);
    }
  }, [sdk, loadedAsset, updateFocus, point]);

  const onAssetLoad = (asset?: Asset) => {
    onEntityFetchComplete();
    setLoadedAsset(asset);
  }

  const wrapper = {
    textAlign: 'center' as const,
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
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    backgroundPosition: 'unset',
    position: 'relative' as const, // wierd typescript complant
  };

  if (loadedAsset && blurBackground && !imageFitCover) {
    const file = sdk.field.locale
      ? loadedAsset.fields.file[sdk.field.locale]
      : loadedAsset.fields.file[sdk.locales.default];

    wrapper.backgroundImage = `url(${file.url})`;
    wrapper.backgroundSize = 'cover';
    wrapper.backgroundPosition = 'center';
  }

  return (
    <LinkedBlockWrapper
      attributes={attributes}
      card={
        <div className={css(wrapper)}>
          {entityType == 'Entry' &&
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
          }
          {entityType == 'Asset' &&
          <>
            {blurBackground && !imageFitCover && <div className={wrapperBlur}></div>}
            <Stack
              flexDirection='row'
              justifyContent='center'
              className={css`position: relative; z-index: 1;`}
            >
              <Stack flexDirection='column'>
                {/* Image fit */}
                <Tooltip placement="right"
                  id="tooltip-fit"
                  content={imageFitCover ? 'Image will cover the container' : 'Image will be contained in the container'}
                >
                  <ToggleButton
                    className={toggle}
                    isActive={imageFitCover}
                    aria-label='cover or contain image'
                    size='small'
                    icon={
                      imageFitCover
                        ? <svg width='24px' height='24px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.7092 2.29502C21.8041 2.3904 21.8757 2.50014 21.9241 2.61722C21.9727 2.73425 21.9996 2.8625 22 2.997L22 3V9C22 9.55228 21.5523 10 21 10C20.4477 10 20 9.55228 20 9V5.41421L14.7071 10.7071C14.3166 11.0976 13.6834 11.0976 13.2929 10.7071C12.9024 10.3166 12.9024 9.68342 13.2929 9.29289L18.5858 4H15C14.4477 4 14 3.55228 14 3C14 2.44772 14.4477 2 15 2H20.9998C21.2749 2 21.5242 2.11106 21.705 2.29078L21.7092 2.29502Z" fill="#000000"></path> <path d="M10.7071 14.7071L5.41421 20H9C9.55228 20 10 20.4477 10 21C10 21.5523 9.55228 22 9 22H3.00069L2.997 22C2.74301 21.9992 2.48924 21.9023 2.29502 21.7092L2.29078 21.705C2.19595 21.6096 2.12432 21.4999 2.07588 21.3828C2.02699 21.2649 2 21.1356 2 21V15C2 14.4477 2.44772 14 3 14C3.55228 14 4 14.4477 4 15V18.5858L9.29289 13.2929C9.68342 12.9024 10.3166 12.9024 10.7071 13.2929C11.0976 13.6834 11.0976 14.3166 10.7071 14.7071Z" fill="#000000"></path> </g></svg>
                        : <svg width='24px' height='24px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.7071 3.70711L16.4142 9H20C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H14.0007L13.997 11C13.743 10.9992 13.4892 10.9023 13.295 10.7092L13.2908 10.705C13.196 10.6096 13.1243 10.4999 13.0759 10.3828C13.0273 10.2657 13.0004 10.1375 13 10.003L13 10V4C13 3.44772 13.4477 3 14 3C14.5523 3 15 3.44772 15 4V7.58579L20.2929 2.29289C20.6834 1.90237 21.3166 1.90237 21.7071 2.29289C22.0976 2.68342 22.0976 3.31658 21.7071 3.70711Z" fill="#000000"></path> <path d="M9 20C9 20.5523 9.44772 21 10 21C10.5523 21 11 20.5523 11 20V14.0007C11 13.9997 11 13.998 11 13.997C10.9992 13.7231 10.8883 13.4752 10.7092 13.295C10.7078 13.2936 10.7064 13.2922 10.705 13.2908C10.6096 13.196 10.4999 13.1243 10.3828 13.0759C10.2657 13.0273 10.1375 13.0004 10.003 13C10.002 13 10.001 13 10 13H4C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H7.58579L2.29289 20.2929C1.90237 20.6834 1.90237 21.3166 2.29289 21.7071C2.68342 22.0976 3.31658 22.0976 3.70711 21.7071L9 16.4142V20Z" fill="#000000"></path> </g></svg>
                    }
                    onToggle={() => updateFit(!imageFitCover)}
                    isDisabled={isReadOnly}
                  />
                </Tooltip>
                {/* Focal point */}
                <Tooltip placement="right"
                  id="tooltip-point"
                  content={
                    !imageFitCover
                      ? 'A focal point can only be chosen when image fit (above) is set to "cover"'
                      : `Image will be focused on ${!point ? 'center' : 'x: '+ point?.x +', y: ' + point?.y}`
                  }
                >
                  <IconButton
                    aria-label='set focal point'
                    size='small'
                    variant='secondary'
                    icon={<svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fillRule="nonzero" d="M13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2zm-1 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"></path> </g> </g></svg>}
                    onClick={openFocalPoint}
                    isDisabled={isReadOnly || !imageFitCover}
                  />
                </Tooltip>
                {/* Blurred background */}
                <Tooltip placement="right"
                  id="tooltip-background"
                  content={
                    imageFitCover
                      ? 'A blurred background can only be chosen when image fit (above) is set to "contain"'
                      : `The container bakcground will display a blurred copy of the image`
                  }
                >
                  <ToggleButton
                    className={toggle}
                    isActive={blurBackground}
                    aria-label='blur background'
                    size='small'
                    icon={<svg width="24px" height="24px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000" strokeWidth="0.00024000000000000003" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.336"></g><g id="SVGRepo_iconCarrier"> <path d="M5.99988 16.938V19.059L5.05851 20H2.93851L5.99988 16.938ZM22.0015 14.435V16.557L18.5595 20H17.9935L17.9939 18.443L22.0015 14.435ZM8.74988 14H15.2446C16.1628 14 16.9158 14.7071 16.9888 15.6065L16.9946 15.75V20H15.4946V15.75C15.4946 15.6317 15.4124 15.5325 15.3019 15.5066L15.2446 15.5H8.74988C8.63154 15.5 8.5324 15.5822 8.50648 15.6927L8.49988 15.75V20H6.99988V15.75C6.99988 14.8318 7.70699 14.0788 8.60636 14.0058L8.74988 14ZM8.02118 10.4158C8.08088 10.9945 8.26398 11.5367 8.54372 12.0154L1.99951 18.56V16.438L8.02118 10.4158ZM22.0015 9.932V12.055L17.9939 16.065L17.9946 15.75L17.9896 15.5825C17.9623 15.128 17.8246 14.7033 17.6029 14.3348L22.0015 9.932ZM12.0565 4L1.99951 14.06V11.939L9.93551 4H12.0565ZM22.0015 5.432V7.555L16.3346 13.2245C16.0672 13.1089 15.7779 13.0346 15.4746 13.0095L15.2446 13L14.6456 13.0005C14.9874 12.6989 15.2772 12.3398 15.4999 11.9384L22.0015 5.432ZM11.9999 7.00046C13.6567 7.00046 14.9999 8.34361 14.9999 10.0005C14.9999 11.6573 13.6567 13.0005 11.9999 13.0005C10.343 13.0005 8.99988 11.6573 8.99988 10.0005C8.99988 8.34361 10.343 7.00046 11.9999 7.00046ZM11.9999 8.50046C11.1715 8.50046 10.4999 9.17203 10.4999 10.0005C10.4999 10.8289 11.1715 11.5005 11.9999 11.5005C12.8283 11.5005 13.4999 10.8289 13.4999 10.0005C13.4999 9.17203 12.8283 8.50046 11.9999 8.50046ZM7.55851 4L1.99951 9.56V7.438L5.43751 4H7.55851ZM21.0565 4L15.9091 9.14895C15.7923 8.61022 15.5669 8.11194 15.2571 7.67816L18.9345 4H21.0565ZM16.5585 4L14.0148 6.54427C13.5362 6.26463 12.9942 6.08157 12.4157 6.02181L14.4365 4H16.5585Z" fill="#212121"></path> </g></svg>}
                    onToggle={() => updateBlur(!blurBackground)}
                    isDisabled={isReadOnly || imageFitCover}
                  />
                </Tooltip>
                {/* Caption */}
                <Tooltip placement="right"
                  id="tooltip-caption"
                  content='Edit caption'
                >
                  <ToggleButton
                    className={toggle}
                    isActive={hasCaption}
                    aria-label='edit caption'
                    size='small'
                    icon={<svg width="24px" height="24px" fill="#000000" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M128,20A108,108,0,1,0,236,128,108.12217,108.12217,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.0953,84.0953,0,0,1,128,212Zm41.59473-52.79a51.99951,51.99951,0,1,1,0-62.43066,12.0004,12.0004,0,0,1-19.1875,14.418,28.00025,28.00025,0,1,0,0,33.59521A12.00025,12.00025,0,0,1,169.59473,159.21Z"></path> </g></svg>}
                    onToggle={setCaption}
                  />
                </Tooltip>
              </Stack>

              <FetchingWrappedAssetCard
                sdk={sdk}
                assetId={entityId}
                locale={sdk.field.locale}
                isDisabled={isDisabled}
                isSelected={isSelected}
                onRemove={handleRemoveClick}
                onEdit={handleEditClick}
                onEntityFetchComplete={onAssetLoad}
              />
            </Stack>
          </>
      }
        </div>
      }
      link={element.data.target}
    >
      {props.children}
    </LinkedBlockWrapper>
  );
}
