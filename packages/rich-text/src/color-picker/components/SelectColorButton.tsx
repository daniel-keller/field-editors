import React from 'react';
import { forwardRef, Ref } from 'react';

import { Button, ButtonGroup, Flex } from '@contentful/f36-components';
import { ChevronDownIcon, CloseIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { Color } from '../types';
import { ColorBox } from './ColorBox';

const styles = {
  hexValue: css({
    color: tokens.gray500,
    fontVariantNumeric: 'tabular-nums',
    width: '70px',
    display: 'inline-block',
    textAlign: 'left',
  }),
  buttonGroup: css({
    width: '100%',
    justifyContent: 'stretch',
  }),
  pickerButton: css({
    maxWidth: '100%',
    border: '1px solid #CFD9E0',
    flexGrow: 1,
  }),
  clearButton: css({
    border: '1px solid #CFD9E0',
  }),
  relative: css({
    position: 'relative',
  }),
};

interface MenuButtonProps {
  showChevron?: boolean;
  name: string;
  value?: Color | string;
  onClick?: () => void;
  onClearClick?: () => void;
}

function _SelectColorButton(
  { showChevron, name, value, onClick, onClearClick }: MenuButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <ButtonGroup withDivider className={styles.buttonGroup}>
      <Button
        endIcon={showChevron ? <ChevronDownIcon /> : undefined}
        className={styles.pickerButton}
        onClick={onClick}
        ref={ref}
      >
        <Flex alignItems="center" gap="spacingXs" className={styles.relative}>
          <ColorBox color={value} />
          <Flex gap="spacing2Xs">
            {name}{' '}
            <span className={styles.hexValue}>
              {(typeof value === 'string' ? value : value?.value) ?? ''}
            </span>
          </Flex>
        </Flex>
      </Button>
      {value !== undefined && (
        <Button
          className={styles.clearButton}
          variant="secondary"
          startIcon={<CloseIcon />}
          onClick={onClearClick}
        >
          Clear
        </Button>
      )}
    </ButtonGroup>
  );
}

export const SelectColorButton = forwardRef(_SelectColorButton);
