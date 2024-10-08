import * as React from 'react';

import { FieldAppSDK } from '@contentful/app-sdk';
import { Flex, Icon, Menu } from '@contentful/f36-components';
import { EmbeddedEntryInlineIcon, AssetIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { useContentfulEditor } from '../../ContentfulEditorProvider';
import { moveToTheNextChar } from '../../helpers/editor';
import { INLINES } from '../../rich-text-types/src';
import { useSdkContext } from '../../SdkProvider';
import { selectEntityAndInsert, selectResourceEntityAndInsert } from '../shared/EmbeddedInlineUtil';
import { ResourceNewBadge } from './ResourceNewBadge';

const styles = {
  icon: css({
    marginRight: '10px',
  }),

  root: css({
    display: 'inline-block',
    margin: `0 ${tokens.spacing2Xs}`,
    fontSize: 'inherit',
    span: {
      userSelect: 'none',
    },
  }),
};

interface EmbeddedInlineToolbarIconProps {
  onClose: () => void;
  nodeType: string;
  isDisabled: boolean;
}

export function EmbeddedInlineToolbarIcon({
  onClose,
  nodeType,
  isDisabled,
}: EmbeddedInlineToolbarIconProps) {
  const editor = useContentfulEditor();
  const sdk: FieldAppSDK = useSdkContext();

  async function handleClick(event) {
    event.preventDefault();

    if (!editor) return;

    onClose();
    if (nodeType === INLINES.EMBEDDED_RESOURCE) {
      await selectResourceEntityAndInsert(editor, sdk, editor.tracking.onToolbarAction);
    } else {
      await selectEntityAndInsert(nodeType, editor, sdk, editor.tracking.onToolbarAction);
    }

    moveToTheNextChar(editor);
  }

  const type = getEntityTypeFromNodeType(nodeType);

  return (
    <Menu.Item
      disabled={isDisabled}
      className="rich-text__entry-link-block-button"
      testId={`toolbar-toggle-${nodeType}`}
      onClick={handleClick}
    >
      <Flex alignItems="center" flexDirection="row">
        <Icon
          as={type === 'Asset' ? AssetIcon : EmbeddedEntryInlineIcon}
          className={`rich-text__embedded-entry-list-icon ${styles.icon}`}
          variant="secondary"
        />
        <span>
          Inline {type}
          {nodeType == INLINES.EMBEDDED_RESOURCE && <ResourceNewBadge />}
        </span>
      </Flex>
    </Menu.Item>
  );
}

function getEntityTypeFromNodeType(nodeType: string): string | never {
  const words = nodeType.toLowerCase().split('-');
  if (words.includes('entry') || words.includes('resource')) {
    return 'Entry';
  }
  if (words.includes('asset')) {
    return 'Asset';
  }
  throw new Error(`Node type \`${nodeType}\` has no associated \`entityType\``);
}
