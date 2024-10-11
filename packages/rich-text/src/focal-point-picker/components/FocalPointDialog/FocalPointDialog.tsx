import React, { useEffect } from 'react';

import { Button, Subheading, ModalContent, ModalControls, Form } from '@contentful/f36-components';

import { FocalPoint } from '../FocalPoint';
import { ImagePreviewWithFocalPoint } from '../ImagePreviewWithFocalPoint';
import { MAX_PREVIEW_WRAPPER_SIZE, styles } from './styles';
import { Asset, FieldAppSDK, EntityProvider } from '@contentful/field-editor-reference';
import { ModalDialogLauncher } from '@contentful/field-editor-shared';


export interface Point {
  x: number
  y: number
}

interface AssetFile {
  url: any
  details: {
    image: {
      width: any
      height: any
    }
  }
}

interface Props {
  sdk: FieldAppSDK
  asset: Asset
  focalPoint?: Point
  locale?: string
  onClose: () => void
  onSave: (focalPoint: Point) => void
}

export function FocalPointDialog (props: Props) {
  const defaultLocale = props.sdk.locales.default;

  const file = props.locale
    ? props.asset.fields.file[props.locale]
    : props.asset.fields.file[defaultLocale];

  const imgRef = React.createRef<HTMLImageElement>();
  const [focalPoint, setFocalPoint] = React.useState<Point>(props.focalPoint ?? {
    x: file.details?.image.width / 2,
    y: file.details?.image.height / 2,
  });
  const [imgElementRect, setImgElementRect] = React.useState<DOMRect |  null>(null);

  useEffect(() => {
    const onWindowResize = () => {
      if (imgRef.current) {
        setImgElementRect(imgRef.current.getBoundingClientRect());
      }
    };

    window.addEventListener('resize', onWindowResize);
    return () =>
      window.removeEventListener('resize', onWindowResize);
  }, [imgRef]);

  // componentDidMount() {
  //   window.addEventListener('resize', this.onWindowResize);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.onWindowResize);
  // }

  const getAdjustedFocalPointForUI = () => {
    // const { file } = props;

    if (imgElementRect?.width && imgElementRect?.height) {
      const { width, height } = file.details?.image ?? {width: 0, height: 0};
      const widthRatio = width / imgElementRect.width;
      const heightRatio = height / imgElementRect.height;

      const marginLeft = Math.max((MAX_PREVIEW_WRAPPER_SIZE - imgElementRect.width) / 2, 0);
      const marginTop = Math.max((MAX_PREVIEW_WRAPPER_SIZE - imgElementRect.height) / 2, 0);

      return {
        x: Math.round(focalPoint.x / widthRatio + marginLeft),
        y: Math.round(focalPoint.y / heightRatio + marginTop),
      };
    }

    return props.focalPoint;
  };

  const onImageClick = (e) => {
    const imageWasClicked = imgRef.current === e.target;
    if (!imageWasClicked) {
      return;
    }

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { width, height } = file.details?.image ?? {width: 0, height: 0};

    const widthRatio = width / rect.width;
    const heightRatio = height / rect.height;

    const actualX = Math.round(x * widthRatio);
    const actualY = Math.round(y * heightRatio);

    setFocalPoint({ x: actualX, y: actualY });
  };

  const onImageLoad = (e) =>
    setImgElementRect(e.target.getBoundingClientRect());

  // onWindowResize = () =>
  //   this.setState({
  //     imgElementRect: this.imgRef.current.getBoundingClientRect(),
  //   });

  // const { file } = props;
  // const { focalPoint, imgElementRect } = state;
  const shouldRenderFocalPoint = !!focalPoint && !!imgElementRect;

  if (typeof file?.url === 'undefined') {
    return <></>;
  }

  return (
    <EntityProvider sdk={props.sdk}>
      <>
        <ModalContent>
          <Form>
            <div className={styles.modalContent}>
              <div>
                <Subheading className={styles.subheading}>Select position of focal point</Subheading>
                <div className={styles.previewWrapper}>
                  <div
                    className={styles.previewImg}
                    role="button"
                    tabIndex={-1}
                    onClick={onImageClick}
                    onKeyDown={() => {}}>
                    <img
                      ref={imgRef}
                      src={file.url}
                      onLoad={onImageLoad}
                      alt="focal point preview"
                    />
                  </div>
                  {shouldRenderFocalPoint && (
                    <FocalPoint focalPoint={getAdjustedFocalPointForUI()} />
                  )}
                </div>
              </div>
              <div className={styles.focalPointDemo}>
                <Subheading className={styles.subheading}>
                  Preview for different screen sizes
                </Subheading>
                <div className={styles.displayFlex}>
                  <ImagePreviewWithFocalPoint
                    className=''
                    file={file as unknown as AssetFile}
                    focalPoint={focalPoint}
                    wrapperWidth={410}
                    wrapperHeight={180}
                    subtitle="Desktop"
                  />
                </div>
                <div className={styles.displayFlex}>
                  <ImagePreviewWithFocalPoint
                    className=''
                    file={file as unknown as AssetFile}
                    focalPoint={focalPoint}
                    wrapperWidth={280}
                    wrapperHeight={180}
                    subtitle="Tablet"
                  />
                  <ImagePreviewWithFocalPoint
                    className={styles.spacingLeftXs}
                    file={file as unknown as AssetFile}
                    focalPoint={focalPoint}
                    wrapperWidth={120}
                    wrapperHeight={180}
                    subtitle="Mobile"
                  />
                </div>
              </div>
            </div>
          </Form>
        </ModalContent>
        <ModalControls>
          <Button
            onClick={props.onClose}
            variant="secondary"
            size='small'
          >
            Cancel
          </Button>
          <Button
            onClick={() => props.onSave(focalPoint)}
            variant="positive"
            size='small'
          >
            Save
          </Button>
        </ModalControls>
      </>
    </EntityProvider>
  );
}

/**
   * Open focal ponit dialog
   */
export async function setFocalPointForAsset (
  sdk: FieldAppSDK,
  asset: Asset,
  point?: Point
) {
  return await ModalDialogLauncher.openDialog(
    {
      title: 'Set focal point',
      width: 'fullWidth',
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true,
      allowHeightOverflow: true,
    },
    ({ onClose }) => {
      return (
        <FocalPointDialog
          focalPoint={point}
          locale={sdk.field.locale}
          asset={asset}
          onSave={onClose}
          onClose={() => onClose(point)}
          sdk={sdk}
        />
      );
    }
  );
}
