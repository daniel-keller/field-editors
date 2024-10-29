import * as React from 'react';

import { FieldAppSDK } from '@contentful/app-sdk';
import { Flex, IconButton, Menu } from '@contentful/f36-components';
import { MoreHorizontalIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { useContentfulEditor } from '../ContentfulEditorProvider';
import { isNodeTypeSelected } from '../helpers/editor';
import { isMarkEnabled, isNodeTypeEnabled } from '../helpers/validations';
import { isMarkActive } from '../internal/queries';
import { ToolbarAlignButton } from '../plugins/Align';
import { ToolbarColumnButton } from '../plugins/Column';
import { ToolbarHeadingButton } from '../plugins/Heading';
import { ToolbarHrButton } from '../plugins/Hr';
import { ToolbarHyperlinkButton } from '../plugins/Hyperlink';
import { ToolbarListButton } from '../plugins/List';
import { ToolbarBoldButton } from '../plugins/Marks/Bold';
import { ToolbarAssetGalleryButton } from '../plugins/AssetGallery';
import { ToolbarIFrameButton } from '../plugins/IFrame';
import { ToolbarCodeButton, ToolbarDropdownCodeButton } from '../plugins/Marks/Code';
import { ToolbarItalicButton } from '../plugins/Marks/Italic';
import {
  ToolbarDropdownStrikethroughButton,
  ToolbarStrikethroughButton,
} from '../plugins/Marks/Strikethrough';
import { ToolbarDropdownSubscriptButton, ToolbarSubscriptButton } from '../plugins/Marks/Subscript';
import {
  ToolbarDropdownSuperscriptButton,
  ToolbarSuperscriptButton,
} from '../plugins/Marks/Superscript';
import { ToolbarAccordionButton } from '../plugins/Accordion';
import { ToolbarUnderlineButton } from '../plugins/Marks/Underline';
import { ToolbarQuoteButton } from '../plugins/Quote';
import { ToolbarTableButton } from '../plugins/Table';
import { BLOCKS, INLINES, MARKS } from '../rich-text-types/src';
import { useSdkContext } from '../SdkProvider';
import { ButtonRedo } from './components/ButtonRedo';
import { ButtonUndo } from './components/ButtonUndo';
import { EmbedEntityWidget } from './components/EmbedEntityWidget';
import { ToolbarFilloutFormButton } from '../plugins/FilloutForm';

type ToolbarProps = {
  isDisabled?: boolean;
  restrictedBlocks?: string[];
};

const styles = {
  toolbar: css({
    border: `1px solid ${tokens.gray400}`,
    backgroundColor: tokens.gray100,
    padding: tokens.spacingXs,
    borderRadius: `${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium} 0 0`,
  }),
  toolbarBtn: css({
    height: '30px',
    width: '30px',
    marginLeft: tokens.spacing2Xs,
    marginRight: tokens.spacing2Xs,
  }),
  divider: css({
    display: 'inline-block',
    height: '21px',
    width: '1px',
    background: tokens.gray300,
    margin: `0 ${tokens.spacing2Xs}`,
  }),
  embedActionsWrapper: css({
    display: ['-webkit-box', '-ms-flexbox', 'flex'],
    webkitAlignSelf: 'flex-start',
    alignSelf: 'flex-start',
    msFlexItemAlign: 'start',
  }),
  formattingOptionsWrapper: css({
    display: ['-webkit-box', '-ms-flexbox', 'flex'],
    msFlexAlign: 'center',
    webkitBoxAlign: 'center',
    alignItems: 'center',
    msFlexWrap: 'wrap',
    flexWrap: 'wrap',
    marginRight: '20px',
  }),
};

const dropdownMarks = [MARKS.SUPERSCRIPT, MARKS.SUBSCRIPT, MARKS.CODE, MARKS.STRIKETHROUGH];

const Dropdown = ({ sdk, isDisabled }: { sdk: FieldAppSDK; isDisabled?: boolean }) => {
  const editor = useContentfulEditor();
  const isActive = editor && dropdownMarks.some((mark) => isMarkActive(editor, mark));

  return (
    <Menu>
      <Menu.Trigger>
        <span>
          <IconButton
            size="small"
            className={styles.toolbarBtn}
            variant={isActive ? 'secondary' : 'transparent'}
            icon={<MoreHorizontalIcon />}
            aria-label="toggle menu"
            isDisabled={isDisabled}
            testId="dropdown-toolbar-button"
          />
        </span>
      </Menu.Trigger>
      <Menu.List>
        {isMarkEnabled(sdk.field, MARKS.SUPERSCRIPT) && (
          <ToolbarDropdownSuperscriptButton isDisabled={isDisabled} />
        )}
        {isMarkEnabled(sdk.field, MARKS.SUBSCRIPT) && (
          <ToolbarDropdownSubscriptButton isDisabled={isDisabled} />
        )}
        {isMarkEnabled(sdk.field, MARKS.STRIKETHROUGH) && (
          <ToolbarDropdownStrikethroughButton isDisabled={isDisabled} />
        )}
        {isMarkEnabled(sdk.field, MARKS.CODE) && (
          <ToolbarDropdownCodeButton isDisabled={isDisabled} />
        )}
      </Menu.List>
    </Menu>
  );
};

const Toolbar = ({ isDisabled, restrictedBlocks }: ToolbarProps) => {
  const sdk = useSdkContext();
  const editor = useContentfulEditor();
  const canInsertBlocks = !isNodeTypeSelected(editor, BLOCKS.TABLE);
  const validationInfo = React.useMemo(() => getValidationInfo(sdk.field), [sdk.field]);
  const isListSelected =
    isNodeTypeSelected(editor, BLOCKS.UL_LIST) || isNodeTypeSelected(editor, BLOCKS.OL_LIST);
  const isAccorionTitleSelected = isNodeTypeSelected(editor, BLOCKS.ACCORDION_TITLE);
  const isBlockquoteSelected = isNodeTypeSelected(editor, BLOCKS.QUOTE);
  const shouldDisableTables =
    isDisabled || !canInsertBlocks || isListSelected || isBlockquoteSelected;

  // We only show the dropdown when: whenever at least bold , italic and underline are available; If nothing that would go inside the dropdown is available, we hide it
  const boldItalicUnderlineAvailable =
    isMarkEnabled(sdk.field, MARKS.BOLD) ||
    isMarkEnabled(sdk.field, MARKS.ITALIC) ||
    isMarkEnabled(sdk.field, MARKS.UNDERLINE);
  const dropdownItemsAvailable = dropdownMarks.some((mark) => isMarkEnabled(sdk.field, mark));

  const shouldShowDropdown = boldItalicUnderlineAvailable && dropdownItemsAvailable;

  const visibleIframe = isNodeTypeEnabled(sdk.field, BLOCKS.IFRAME, restrictedBlocks);
  const visibleFillout = isNodeTypeEnabled(sdk.field, BLOCKS.FILLOUT_FORM, restrictedBlocks);
  const visibleColumn = isNodeTypeEnabled(sdk.field, BLOCKS.COLUMN, restrictedBlocks);
  const visibleAccordion = isNodeTypeEnabled(sdk.field, BLOCKS.ACCORDION, restrictedBlocks);
  const visibleAssetGallery = isNodeTypeEnabled(sdk.field, BLOCKS.ASSET_GALLERY, restrictedBlocks);

  return (
    <Flex
      gap="spacingS"
      flexWrap="wrap"
      flexDirection="row"
      testId="toolbar"
      className={styles.toolbar}
      justifyContent="space-between"
    >
      <div className={styles.formattingOptionsWrapper}>
        <ToolbarHeadingButton isDisabled={isDisabled || !canInsertBlocks} />

        <span className={styles.divider} />
        <ButtonUndo />
        <ButtonRedo />
        {validationInfo.isAnyMarkEnabled && <span className={styles.divider} />}

        {isMarkEnabled(sdk.field, MARKS.BOLD) && <ToolbarBoldButton isDisabled={isDisabled || isAccorionTitleSelected} />}
        {isMarkEnabled(sdk.field, MARKS.ITALIC) && <ToolbarItalicButton isDisabled={isDisabled} />}

        {isMarkEnabled(sdk.field, MARKS.UNDERLINE) && (
          <ToolbarUnderlineButton isDisabled={isDisabled} />
        )}

        {!boldItalicUnderlineAvailable && isMarkEnabled(sdk.field, MARKS.SUPERSCRIPT) && (
          <ToolbarSuperscriptButton isDisabled={isDisabled} />
        )}
        {!boldItalicUnderlineAvailable && isMarkEnabled(sdk.field, MARKS.SUBSCRIPT) && (
          <ToolbarSubscriptButton isDisabled={isDisabled} />
        )}
        {!boldItalicUnderlineAvailable && isMarkEnabled(sdk.field, MARKS.STRIKETHROUGH) && (
          <ToolbarStrikethroughButton isDisabled={isDisabled} />
        )}
        {!boldItalicUnderlineAvailable && isMarkEnabled(sdk.field, MARKS.CODE) && (
          <ToolbarCodeButton isDisabled={isDisabled} />
        )}

        {shouldShowDropdown && <Dropdown sdk={sdk} isDisabled={isDisabled} />}

        {validationInfo.isAnyHyperlinkEnabled && (
          <>
            <span className={styles.divider} />
            <ToolbarHyperlinkButton isDisabled={isDisabled} />
          </>
        )}

        <span className={styles.divider} />

        <ToolbarAlignButton isDisabled={isDisabled || isAccorionTitleSelected} />

        <ToolbarListButton isDisabled={isDisabled || !canInsertBlocks} restrictedBlocks={restrictedBlocks}/>

        {isNodeTypeEnabled(sdk.field, BLOCKS.QUOTE, restrictedBlocks) && (
          <ToolbarQuoteButton isDisabled={isDisabled || !canInsertBlocks} />
        )}
        {isNodeTypeEnabled(sdk.field, BLOCKS.HR, restrictedBlocks) && (
          <ToolbarHrButton isDisabled={isDisabled || !canInsertBlocks} />
        )}
        {isNodeTypeEnabled(sdk.field, BLOCKS.TABLE, restrictedBlocks) && (
          <ToolbarTableButton isDisabled={shouldDisableTables} />
        )}

        {(visibleIframe ||  visibleFillout) && <span className={styles.divider}/>}

        {visibleIframe && <ToolbarIFrameButton isDisabled={shouldDisableTables}/>}
        {visibleFillout && <ToolbarFilloutFormButton isDisabled={shouldDisableTables}/>}

        {(visibleColumn || visibleAccordion || visibleAssetGallery) && <span className={styles.divider} />}

        {visibleColumn && <ToolbarColumnButton isDisabled={shouldDisableTables}/>}
        {visibleAccordion && <ToolbarAccordionButton isDisabled={shouldDisableTables}/>}
        {visibleAssetGallery && <ToolbarAssetGalleryButton isDisabled={shouldDisableTables}/>}
      </div>
      <div className={styles.embedActionsWrapper}>
        <EmbedEntityWidget
          isDisabled={isDisabled}
          canInsertBlocks={canInsertBlocks}
          restrictedBlocks={restrictedBlocks}
        />
      </div>
    </Flex>
  );
};

function getValidationInfo(field: FieldAppSDK['field']): {
  isAnyMarkEnabled: boolean;
  isAnyHyperlinkEnabled: boolean;
  isAnyBlockFormattingEnabled: boolean;
} {
  const someWithValidation = (vals, validation) => vals.some((val) => validation(field, val));

  const isAnyMarkEnabled = someWithValidation(Object.values(MARKS), isMarkEnabled);

  const isAnyHyperlinkEnabled = someWithValidation(
    [
      INLINES.HYPERLINK,
      INLINES.ASSET_HYPERLINK,
      INLINES.ENTRY_HYPERLINK,
      INLINES.RESOURCE_HYPERLINK,
    ],
    isNodeTypeEnabled
  );

  const isAnyBlockFormattingEnabled = someWithValidation(
    [BLOCKS.UL_LIST, BLOCKS.OL_LIST, BLOCKS.QUOTE, BLOCKS.HR],
    isNodeTypeEnabled
  );

  return {
    isAnyMarkEnabled,
    isAnyHyperlinkEnabled,
    isAnyBlockFormattingEnabled,
  };
}

export default Toolbar;
