import * as React from 'react';

import {
  TextLink,
  Button,
  FormControl,
  FormLabel,
  Select,
  TextInput,
  Form,
  ModalContent,
  ModalControls,
  Switch,
  Stack,
  Radio,
  IconButton,
} from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { EntityProvider } from '@contentful/field-editor-reference';
import { Link } from '@contentful/field-editor-reference';
import { ModalDialogLauncher, FieldAppSDK } from '@contentful/field-editor-shared';
import { css } from 'emotion';

import ColorPickerField from '../../color-picker/ColorPickerField';
import { getNodeEntryFromSelection, insertLink, LINK_TYPES, focus } from '../../helpers/editor';
import getAllowedResourcesForNodeType from '../../helpers/getAllowedResourcesForNodeType';
import getLinkedContentTypeIdsForNodeType from '../../helpers/getLinkedContentTypeIdsForNodeType';
import { isNodeTypeEnabled } from '../../helpers/validations';
import { withoutNormalizing } from '../../internal';
import { getText, isEditorReadOnly } from '../../internal/queries';
import { select } from '../../internal/transforms';
import { PlateEditor, Path } from '../../internal/types';
import { TrackingPluginActions } from '../../plugins/Tracking';
import { INLINES, ResourceLink } from '../../rich-text-types/src';
import { FetchingWrappedAssetCard } from '../shared/FetchingWrappedAssetCard';
import { FetchingWrappedEntryCard } from '../shared/FetchingWrappedEntryCard';
import { FetchingWrappedResourceCard } from '../shared/FetchingWrappedResourceCard';
import { IconPopover, Icons } from './IconPopover';

const styles = {
  removeSelectionLabel: css`
    margin-left: ${tokens.spacingS};
    margin-bottom: ${tokens.spacingXs}; // to match FormLabel margin
  `,
  openInNewTabSwitch: css`
    margin-top: ${tokens.spacingL};
  `,
  target: css`
    align-items: center;
    display: flex;
    margin-bottom: 0;
    gap: 3px;
  `,
};

interface HyperlinkModalProps {
  linkText?: string;
  linkType?: string;
  linkTarget?: string;
  linkEntity?: Link | ResourceLink;
  openTab?: boolean;
  isButton?: boolean;
  buttonSize?: string;
  buttonVariant?: string;
  buttonColor?: string;
  buttonLeadingIcon?: string;
  buttonTrailingIcon?: string;
  onClose: (value: unknown) => void;
  sdk: FieldAppSDK;
  readonly: boolean;
}

const SYS_LINK_TYPES = {
  [INLINES.ENTRY_HYPERLINK]: 'Entry',
  [INLINES.ASSET_HYPERLINK]: 'Asset',
  [INLINES.RESOURCE_HYPERLINK]: 'Contentful:Entry',
};

const LINK_TYPE_SELECTION_VALUES = {
  [INLINES.HYPERLINK]: 'URL',
  [INLINES.ENTRY_HYPERLINK]: 'Entry',
  [INLINES.RESOURCE_HYPERLINK]: 'Entry (different space)',
  [INLINES.ASSET_HYPERLINK]: 'Asset',
};

export function HyperlinkModal(props: HyperlinkModalProps) {
  const enabledLinkTypes = LINK_TYPES.filter((nodeType) =>
    isNodeTypeEnabled(props.sdk.field, nodeType)
  );
  const [defaultLinkType] = enabledLinkTypes;
  const [linkText, setLinkText] = React.useState(props.linkText ?? '');
  const [linkType, setLinkType] = React.useState(props.linkType ?? defaultLinkType);
  const [linkTarget, setLinkTarget] = React.useState(props.linkTarget ?? '');
  const [linkEntity, setLinkEntity] = React.useState<Link | ResourceLink | null>(
    props.linkEntity ?? null
  );
  const linkTargetInputRef = React.useRef<HTMLInputElement>(null);

  const [openTab, setOpensInNewTab] = React.useState(props.openTab ?? false);
  const [isButton, setIsButton] = React.useState(props.isButton ?? false);
  const [buttonSize, setButtonSize] = React.useState(props.buttonSize ?? 'large');
  const [buttonVariant, setButtonVariant] = React.useState(props.buttonVariant ?? 'contained');
  const [buttonColor, setButtonColor] = React.useState(props.buttonColor);

  const [buttonLeadingIcon, setButtonLeadingIcon] = React.useState<
    [string, React.ReactNode] | undefined
  >(
    props.buttonLeadingIcon && Icons[props.buttonLeadingIcon]
      ? [props.buttonLeadingIcon, Icons[props.buttonLeadingIcon]]
      : undefined
  );
  const [buttonTrailingIcon, setButtonTrailingIcon] = React.useState<
    [string, React.ReactNode] | undefined
  >(
    props.buttonTrailingIcon && Icons[props.buttonTrailingIcon]
      ? [props.buttonTrailingIcon, Icons[props.buttonTrailingIcon]]
      : undefined
  );

  React.useEffect(() => {
    if (linkType === INLINES.HYPERLINK && linkTargetInputRef.current) {
      linkTargetInputRef.current.focus();
    }
  }, [linkType]);

  function isLinkComplete() {
    const isRegularLink = linkType === INLINES.HYPERLINK;
    if (isRegularLink) {
      return !!(linkText && linkTarget);
    }

    const entityLinks: string[] = Object.keys(SYS_LINK_TYPES);
    const isEntityLink = entityLinks.includes(linkType);
    if (isEntityLink) {
      if (linkType === INLINES.ENTRY_HYPERLINK) {
        return !!(linkText && isEntryLink(linkEntity));
      }
      if (linkType === INLINES.ASSET_HYPERLINK) {
        return !!(linkText && isAssetLink(linkEntity));
      }
      if (linkType === INLINES.RESOURCE_HYPERLINK) {
        return !!(linkText && isResourceLink(linkEntity));
      }
      return false;
    }

    return false;
  }

  function handleOnSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    props.onClose({
      linkText,
      linkType,
      linkTarget,
      linkEntity,
      openTab,
      isButton,
      buttonSize,
      buttonVariant,
      buttonColor,
      buttonLeadingIcon: buttonLeadingIcon?.[0],
      buttonTrailingIcon: buttonTrailingIcon?.[0],
    });
  }

  function entityToLink(entity): Link {
    const { id, type } = entity.sys;

    return { sys: { id, type: 'Link', linkType: type } };
  }

  function isResourceLink(link: Link | ResourceLink | null): link is ResourceLink {
    return !!link && !!(link as ResourceLink).sys.urn;
  }

  function isEntryLink(link: Link | ResourceLink | null): link is Link {
    return !!link && link.sys.type === 'Link' && link.sys.linkType === 'Entry';
  }

  function isAssetLink(link: Link | ResourceLink | null): link is Link {
    return !!link && link.sys.type === 'Link' && link.sys.linkType === 'Asset';
  }

  async function selectEntry() {
    const options = {
      locale: props.sdk.field.locale,
      contentTypes: getLinkedContentTypeIdsForNodeType(props.sdk.field, INLINES.ENTRY_HYPERLINK),
    };
    const entry = await props.sdk.dialogs.selectSingleEntry(options);
    if (entry) {
      setLinkTarget('');
      setLinkEntity(entityToLink(entry));
    }
  }

  async function selectResourceEntry() {
    const options = {
      allowedResources: getAllowedResourcesForNodeType(props.sdk.field, INLINES.RESOURCE_HYPERLINK),
    };
    // @ts-expect-error wait for update of app-sdk version
    const entityLink = await props.sdk.dialogs.selectSingleResourceEntity(options);
    if (entityLink) {
      setLinkTarget('');
      setLinkEntity(entityLink);
    }
  }

  async function selectAsset() {
    const options = {
      locale: props.sdk.field.locale,
    };
    const asset = await props.sdk.dialogs.selectSingleAsset(options);
    if (asset) {
      setLinkTarget('');
      setLinkEntity(entityToLink(asset));
    }
  }

  function resetLinkEntity(event: React.MouseEvent) {
    event.preventDefault();

    setLinkEntity(null);
  }

  return (
    <EntityProvider sdk={props.sdk}>
      <>
        <ModalContent>
          <Form>
            {!props.linkType && (
              <FormControl id="link-text" isRequired>
                <FormControl.Label>Link text</FormControl.Label>
                <TextInput
                  testId="link-text-input"
                  name="link-text"
                  value={linkText}
                  onChange={(event) => setLinkText(event.target.value)}
                />
              </FormControl>
            )}

            {enabledLinkTypes.length > 1 && (
              <FormControl id="link-type">
                <FormControl.Label>Link type</FormControl.Label>
                <Select
                  value={linkType}
                  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                    setLinkType(event.target.value)
                  }
                  testId="link-type-input"
                  isDisabled={props.readonly}
                >
                  {enabledLinkTypes.map((nodeType) => (
                    <Select.Option key={nodeType} value={nodeType}>
                      {LINK_TYPE_SELECTION_VALUES[nodeType]}
                    </Select.Option>
                  ))}
                </Select>
              </FormControl>
            )}

            {linkType === INLINES.HYPERLINK && (
              <FormControl id="linkTarget" isRequired>
                <FormControl.Label className={styles.target}>
                  Link target
                  <IconButton
                    aria-label="email address"
                    icon={
                      <>
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    }
                    onClick={() => {
                      setLinkEntity(null);
                      setLinkTarget('mailto:');
                      linkTargetInputRef.current?.focus();
                    }}
                  />
                  <IconButton
                    aria-label="phone number"
                    icon={
                      <>
                        <svg
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.09253 5.63644C4.91414 12.8995 11.1005 19.0859 18.3636 19.9075C19.3109 20.0146 20.1346 19.3271 20.3216 18.3922L20.7004 16.4979C20.8773 15.6135 20.4404 14.7202 19.6337 14.3168L18.3983 13.6992C17.5886 13.2943 16.6052 13.5264 16.062 14.2507C15.7082 14.7224 15.14 15.01 14.5962 14.782C12.7272 13.9986 10.0014 11.2728 9.21796 9.40381C8.99002 8.86004 9.27761 8.2918 9.7493 7.93802C10.4736 7.39483 10.7057 6.41142 10.3008 5.60168L9.68316 4.36632C9.27982 3.55963 8.38646 3.12271 7.50207 3.29959L5.60777 3.67845C4.67292 3.86542 3.98537 4.68912 4.09253 5.63644Z"
                            stroke="#000000"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    }
                    onClick={() => {
                      setLinkEntity(null);
                      setLinkTarget('tel:');
                      linkTargetInputRef.current?.focus();
                    }}
                  />
                </FormControl.Label>
                <TextInput
                  ref={linkTargetInputRef}
                  name="linkTarget"
                  value={linkTarget}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLinkEntity(null);
                    setLinkTarget(event.target.value);
                  }}
                  testId="link-target-input"
                  isDisabled={props.readonly}
                />
                <FormControl.HelpText>
                  A protocol may be required, e.g. https://
                </FormControl.HelpText>
              </FormControl>
            )}

            {linkType !== INLINES.HYPERLINK && (
              <div>
                <FormLabel isRequired htmlFor="">
                  Link target{' '}
                </FormLabel>

                {linkEntity && linkEntity.sys.linkType === SYS_LINK_TYPES[linkType] ? (
                  <>
                    {!props.readonly && (
                      <TextLink
                        testId="entity-selection-link"
                        onClick={resetLinkEntity}
                        className={styles.removeSelectionLabel}
                      >
                        Remove selection
                      </TextLink>
                    )}
                    <div className={styles.removeSelectionLabel}>
                      {linkType === INLINES.ENTRY_HYPERLINK && isEntryLink(linkEntity) && (
                        <FetchingWrappedEntryCard
                          sdk={props.sdk}
                          locale={props.sdk.field.locale}
                          entryId={linkEntity.sys.id}
                          isDisabled={true}
                          isSelected={false}
                        />
                      )}
                      {linkType === INLINES.RESOURCE_HYPERLINK && isResourceLink(linkEntity) && (
                        <FetchingWrappedResourceCard
                          sdk={props.sdk}
                          link={linkEntity.sys}
                          isDisabled={true}
                          isSelected={false}
                        />
                      )}
                      {linkType === INLINES.ASSET_HYPERLINK && isAssetLink(linkEntity) && (
                        <FetchingWrappedAssetCard
                          sdk={props.sdk}
                          locale={props.sdk.field.locale}
                          assetId={linkEntity.sys.id}
                          isDisabled={true}
                          isSelected={false}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div>
                    {linkType === INLINES.ENTRY_HYPERLINK && (
                      <TextLink testId="entity-selection-link" onClick={selectEntry}>
                        Select entry
                      </TextLink>
                    )}
                    {linkType === INLINES.RESOURCE_HYPERLINK && (
                      <TextLink testId="entity-selection-link" onClick={selectResourceEntry}>
                        Select entry
                      </TextLink>
                    )}
                    {linkType === INLINES.ASSET_HYPERLINK && (
                      <TextLink testId="entity-selection-link" onClick={selectAsset}>
                        Select asset
                      </TextLink>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className={styles.openInNewTabSwitch}>
              <FormControl id="openInNewTab">
                <Switch
                  name="openInNewTab"
                  isChecked={openTab}
                  onChange={() => setOpensInNewTab((prevState) => !prevState)}
                >
                  Open link in new tab
                </Switch>
              </FormControl>
            </div>

            <div className={styles.openInNewTabSwitch}>
              <FormControl id="isButton">
                <Switch
                  name="isButton"
                  isChecked={isButton}
                  onChange={() => setIsButton((prevState) => !prevState)}
                >
                  Display as a Button
                </Switch>
              </FormControl>
            </div>

            {isButton && (
              <div className={styles.openInNewTabSwitch}>
                <Stack flexDirection="row" spacing="spacing2Xl">
                  <FormControl id="size">
                    <FormLabel>Size</FormLabel>
                    <Stack flexDirection="row">
                      <Radio
                        id="radio-large"
                        name="radio-size-uncontrolled"
                        value="large"
                        isChecked={buttonSize === 'large'}
                        onChange={() => setButtonSize('large')}
                      >
                        Large
                      </Radio>
                      <Radio
                        id="radio-medium"
                        name="radio-size-uncontrolled"
                        value="medium"
                        isChecked={buttonSize === 'medium'}
                        onChange={() => setButtonSize('medium')}
                      >
                        Medium
                      </Radio>
                      <Radio
                        id="radio-small"
                        name="radio-size-uncontrolled"
                        value="small"
                        isChecked={buttonSize === 'small'}
                        onChange={() => setButtonSize('small')}
                      >
                        Small
                      </Radio>
                    </Stack>
                  </FormControl>

                  <FormControl id="style">
                    <FormLabel>Style</FormLabel>
                    <Stack flexDirection="row">
                      <Radio
                        id="radio-contained"
                        name="radio-style-uncontrolled"
                        value="contained"
                        isChecked={buttonVariant === 'contained'}
                        onChange={() => setButtonVariant('contained')}
                      >
                        Filled
                      </Radio>
                      <Radio
                        id="radio-outlined"
                        name="radio-style-uncontrolled"
                        value="outlined"
                        isChecked={buttonVariant === 'outlined'}
                        onChange={() => setButtonVariant('outlined')}
                      >
                        Outlined
                      </Radio>
                      <Radio
                        id="radio-text"
                        name="radio-style-uncontrolled"
                        value="text"
                        isChecked={buttonVariant === 'text'}
                        onChange={() => setButtonVariant('text')}
                      >
                        Text
                      </Radio>
                    </Stack>
                  </FormControl>
                </Stack>

                <Stack flexDirection="row" alignItems="start">
                  <FormControl id="leadingIcon">
                    <IconPopover
                      inputTitle="Leading Icon"
                      onSelect={(icon) => {
                        if (icon) return setButtonLeadingIcon(icon);
                        setButtonLeadingIcon(undefined);
                      }}
                      leadingIcon={buttonLeadingIcon?.[0]}
                    />
                  </FormControl>

                  <FormControl id="trailingIcon">
                    <IconPopover
                      inputTitle="Trailing Icon"
                      onSelect={(icon) => {
                        if (icon) return setButtonTrailingIcon(icon);
                        setButtonTrailingIcon(undefined);
                      }}
                      trailingIcon={buttonTrailingIcon?.[0]}
                    />
                  </FormControl>

                  <ColorPickerField
                    color={buttonColor}
                    onChange={(color) => setButtonColor(color)}
                  />
                </Stack>
              </div>
            )}
          </Form>
        </ModalContent>
        <ModalControls>
          <Button
            type="button"
            onClick={() => props.onClose(null)}
            variant="secondary"
            testId="cancel-cta"
            size="small"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="positive"
            size="small"
            isDisabled={props.readonly || !isLinkComplete()}
            onClick={handleOnSubmit}
            testId="confirm-cta"
          >
            {props.linkType ? 'Update' : 'Insert'}
          </Button>
        </ModalControls>
      </>
    </EntityProvider>
  );
}

interface HyperLinkDialogData {
  linkTFieldAppSDK;
  linkType: INLINES.HYPERLINK | INLINES.ASSET_HYPERLINK | INLINES.ENTRY_HYPERLINK;
  linkText: string;
  linkTarget?: string;
  linkEntity?: Link;
  openTab?: boolean;
  isButton?: boolean;
  buttonSize: string;
  buttonVariant: string;
  buttonColor: string;
  buttonLeadingIcon: string;
  buttonTrailingIcon: string;
}

export async function addOrEditLink(
  editor: PlateEditor,
  sdk: FieldAppSDK,
  logAction:
    | TrackingPluginActions['onToolbarAction']
    | TrackingPluginActions['onShortcutAction']
    | TrackingPluginActions['onViewportAction'],
  targetPath?: Path
) {
  const isReadOnly = isEditorReadOnly(editor);
  const selectionBeforeBlur = editor.selection ? { ...editor.selection } : undefined;
  if (!targetPath && !selectionBeforeBlur) return;

  let linkType;
  let linkText;
  let linkTarget;
  let linkEntity;
  let openTab;
  let isButton;
  let buttonSize;
  let buttonVariant;
  let buttonColor;
  let buttonLeadingIcon;
  let buttonTrailingIcon;

  const [node, path] = getNodeEntryFromSelection(editor, LINK_TYPES, targetPath);
  if (node && path) {
    linkType = node.type;
    linkText = getText(editor, path);
    linkTarget = (node.data as { uri: string }).uri || '';
    linkEntity = (node.data as { target: Link }).target;
    openTab = (node.data as { openTab?: boolean }).openTab;
    isButton = (node.data as { isButton?: boolean }).isButton;
    if (isButton) {
      buttonSize = (node.data as { size?: string }).size;
      buttonVariant = (node.data as { variant?: string }).variant;
      buttonColor = (node.data as { color?: string }).color;
      buttonLeadingIcon = (node.data as { leadingIcon?: string }).leadingIcon;
      buttonTrailingIcon = (node.data as { trailingIcon?: string }).trailingIcon;
    }
  }

  const selectionAfterFocus =
    targetPath ?? (selectionBeforeBlur as NonNullable<typeof selectionBeforeBlur>);

  const currentLinkText = linkText || (editor.selection ? getText(editor, editor.selection) : '');
  const isEditing = Boolean(node && path);

  logAction(isEditing ? 'openEditHyperlinkDialog' : 'openCreateHyperlinkDialog');

  const data = await ModalDialogLauncher.openDialog(
    {
      title: isEditing ? 'Edit hyperlink' : 'Insert hyperlink',
      width: 'large',
      shouldCloseOnEscapePress: true,
      shouldCloseOnOverlayClick: true,
      allowHeightOverflow: true,
    },
    ({ onClose }) => {
      return (
        <HyperlinkModal
          linkTarget={linkTarget}
          linkText={currentLinkText}
          linkType={linkType}
          linkEntity={linkEntity}
          openTab={openTab}
          isButton={isButton}
          buttonSize={buttonSize}
          buttonVariant={buttonVariant}
          buttonColor={buttonColor}
          buttonLeadingIcon={buttonLeadingIcon}
          buttonTrailingIcon={buttonTrailingIcon}
          onClose={onClose}
          sdk={sdk}
          readonly={isReadOnly}
        />
      );
    }
  );
  select(editor, selectionAfterFocus);

  if (!data) {
    focus(editor);
    logAction(isEditing ? 'cancelEditHyperlinkDialog' : 'cancelCreateHyperlinkDialog');
    return;
  }

  const {
    linkText: text,
    linkTarget: url,
    linkType: type,
    linkEntity: target,
    openTab: newTab,
    isButton: isBtn,
    buttonSize: btnSize,
    buttonVariant: btnVariant,
    buttonColor: btnColor,
    buttonLeadingIcon: btnLeadingIcon,
    buttonTrailingIcon: btnTrailingIcon,
  } = data as HyperLinkDialogData;

  withoutNormalizing(editor, () => {
    insertLink(editor, {
      text,
      url,
      type,
      target,
      path,
      openTab: newTab,
      isButton: isBtn,
      size: btnSize,
      variant: btnVariant,
      color: btnColor,
      leadingIcon: btnLeadingIcon,
      trailingIcon: btnTrailingIcon,
    });
  });

  logAction(isEditing ? 'edit' : 'insert', {
    nodeType: type,
    linkType: target?.sys.linkType ?? 'uri', // we want to keep the same values we've been using for the old editor, which can be `uri`, `Asset` or `Entry`
  });

  focus(editor);
}
