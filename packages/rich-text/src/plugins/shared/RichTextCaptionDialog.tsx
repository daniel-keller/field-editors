import React from 'react';

import { Button, ModalContent, ModalControls } from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/field-editor-reference';
import { ModalDialogLauncher } from '@contentful/field-editor-shared';
// import { Plate, PlateContent } from '@udecode/plate-core';

// import { SyncEditorChanges } from '../../SyncEditorChanges';
import { ConnectedRichTextEditor } from '../../RichTextEditor';
import { EMPTY_DOCUMENT, BLOCKS, INLINES, Document, TopLevelBlock } from '../../rich-text-types/src';


interface Props {
  sdk: FieldAppSDK
  value?: TopLevelBlock[]
  onClose: () => void
  onSave: (caption?: TopLevelBlock[] | undefined) => void
}

export function RichTextCaptionDialog (props: Props) {
  const captionToSave = React.useRef<Document>();
  const [allowSave, setAllowSave] = React.useState(false);

  const initialValue = React.useMemo(() => {
    const documented = {...EMPTY_DOCUMENT};
    if (props.value) documented.content = props.value;
    return documented;
  }, [props.value]);

  const update = (doc: Document) => {
    // if not empty text return undefined
    const nonEmpty = doc.content.filter(n =>
      n.nodeType != BLOCKS.PARAGRAPH ||
      (n.content?.[0].nodeType == 'text' && (n.content?.[0].value.trim() != '')
    ));

    setAllowSave(true);
    if (nonEmpty.length == 0) {
      return captionToSave.current = undefined;
    }

    captionToSave.current = doc;
  }

  return (
    <>
      <ModalContent>
        <ConnectedRichTextEditor
          sdk={props.sdk}
          value={initialValue}
          onChange={update}
          actionsDisabled
          restrictedBlocks={[
            BLOCKS.OL_LIST,
            BLOCKS.UL_LIST,
            BLOCKS.QUOTE,
            BLOCKS.EMBEDDED_ENTRY,
            BLOCKS.EMBEDDED_ASSET,
            BLOCKS.EMBEDDED_RESOURCE,
            BLOCKS.COLUMN,
            BLOCKS.TABLE,
            BLOCKS.ACCORDION,
            BLOCKS.ASSET_GALLERY,
            BLOCKS.IFRAME,
            BLOCKS.FILLOUT_FORM,
            INLINES.EMBEDDED_ENTRY,
            INLINES.EMBEDDED_ASSET,
            INLINES.EMBEDDED_RESOURCE,
          ]}
        />
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
          onClick={() => props.onSave(captionToSave.current?.content)}
          isDisabled={!allowSave}
          variant="positive"
          size='small'
        >
          Save
        </Button>
      </ModalControls>
    </>
  );
}

/**
   * Open focal ponit dialog
   */
export async function setRichTextCaption (
    sdk: FieldAppSDK,
    value?: TopLevelBlock[],
  ) {
    return await ModalDialogLauncher.openDialog<TopLevelBlock[] | undefined>(
      {
        title: 'Edit caption',
        width: 'fullWidth',
        shouldCloseOnEscapePress: true,
        shouldCloseOnOverlayClick: true,
        allowHeightOverflow: true,
      },
      ({ onClose }) => {
        return (
          <RichTextCaptionDialog
            value={value}
            onSave={onClose}
            onClose={() => onClose(value)}
            sdk={sdk}
          />
        );
      }
    );
  }
