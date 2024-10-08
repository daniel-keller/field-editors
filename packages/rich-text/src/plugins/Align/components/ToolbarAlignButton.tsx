import * as React from 'react';

import { Menu, Button } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { getElementFromCurrentSelection, focus } from '../../../helpers/editor';
import { Element } from '../../../internal/types';
import { AlignValuesType, alignValues, defaultAlignValue, setAlign } from '../createAlignPlugin';

const styles = {
  // prevent the layout to jump due switch from "normal text" to "headline" and vice versa
  menuButton: css({
    height: '18px',
    paddingLeft: '5px',
    paddingRight: '5px',
    span: {
      height: '18px',
    },
  }),
  itemButton: css({
    minWidth: 'unset',
  }),
  dropdown: {
    root: css`
      font-weight: ${tokens.fontWeightDemiBold};
    `,
  },
};

const LABELS: Record<AlignValuesType, React.ReactNode> = {
  left: (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H20M4 12H20M4 20H20M4 8H14M4 16H14"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  center: (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H20M4 12H20M4 20H20M7 8H17M7 16H17"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  right: (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H20M4 12H20M4 20H20M10 8H20M10 16H20"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export interface ToolbarAlignButtonProps {
  isDisabled?: boolean;
}

export function ToolbarAlignButton(props: ToolbarAlignButtonProps) {
  const editor = useContentfulEditor();
  const [isOpen, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<AlignValuesType>(defaultAlignValue);

  React.useEffect(() => {
    if (!editor?.selection) return;

    const elements = getElementFromCurrentSelection(editor);

    // Iterate through the elements to identify matches
    // In lists it would otherwise never show the correct block.
    for (const element of elements) {
      if (typeof element === 'object' && 'type' in element) {
        const el = element as Element;

        if (el.data?.align && alignValues.includes(el.data?.align as string)) {
          return setSelected(el.data?.align as AlignValuesType);
        }
      }
    }

    setSelected(defaultAlignValue);
  }, [editor?.operations, editor?.selection]); // eslint-disable-line -- TODO: explain this disable

  function handleOnSelectItem(
    float: AlignValuesType
  ): (event: React.MouseEvent<HTMLButtonElement>) => void {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!editor?.selection) return;

      setAlign(editor, float);
      setOpen(false);

      const prevOnChange = editor.onChange;
      /*
       The focus might happen at point in time when
       `toggleElement` (helper for toggleNodeType) changes aren't rendered yet, causing the browser
       to place the cursor at the start of the text.
       We wait for the change event before focusing
       the editor again. This ensures the cursor is back at the previous
       position.*/
      editor.onChange = (...args) => {
        focus(editor);
        editor.onChange = prevOnChange;
        prevOnChange(...args);
      };

      // if (type !== BLOCKS.PARAGRAPH) {
      //   const isActive = isBlockSelected(editor, type);
      //   editor.tracking.onToolbarAction(isActive ? 'remove' : 'insert', { nodeType: type });
      // }

      // toggleElement(editor, { activeType: type, inactiveType: type });
    };
  }

  if (!editor) return null;

  return (
    <Menu isOpen={isOpen} onClose={() => setOpen(false)}>
      <Menu.Trigger>
        <Button
          size="small"
          variant="transparent"
          endIcon={<ChevronDownIcon />}
          isDisabled={props.isDisabled}
          onClick={() => setOpen(!isOpen)}
          className={styles.menuButton}
        >
          {LABELS[selected]}
        </Button>
      </Menu.Trigger>
      <Menu.List>
        {Object.keys(LABELS).map((float) => (
          <Menu.Item
            key={float}
            isInitiallyFocused={float == defaultAlignValue}
            onClick={handleOnSelectItem(float as AlignValuesType)}
            disabled={props.isDisabled}
            className={styles.itemButton}
          >
            {LABELS[float]}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
}
