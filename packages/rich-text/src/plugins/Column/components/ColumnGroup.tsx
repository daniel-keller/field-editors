import React from 'react';

import { Button, Popover } from '@contentful/f36-components';
import { DeleteIcon } from '@contentful/f36-icons';
import { PlateElement, useElement } from '@udecode/plate-common';
import type { TColumnElement } from '@udecode/plate-layout';
import { withRef } from '@udecode/react-utils';
import { css } from 'emotion';

import { useContentfulEditorRef } from '../../../ContentfulEditorProvider';
import { removeNodes, findNodePath } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';
import { useColumnState } from '../actions/useColumnState';
import { useDebouncePopoverOpen } from '../actions/useDebouncePopoverOpen';
import { ColumnStyleButton } from './ColumnStyleButton';



const group = css`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 1em;
  margin-top: 0.5rem;
  margin-bottom: 1em;
  align-items: stretch;
`;


export const ColumnGroupElement = withRef<typeof PlateElement>(({ children, ...props }, ref) => {

  return (
    <PlateElement ref={ref} {...props}>
      <ColumnFloatingToolbar>
        <div className={group}>{children}</div>
      </ColumnFloatingToolbar>
    </PlateElement>
  );
});

const useRemoveNodeButton = ({ element }) => {
  const editor = useContentfulEditorRef();
  return {
    props: {
      onMouseDown: (e) => {
        e.preventDefault();
      },
      onClick: () => {
        const path = findNodePath(editor, element);
        removeNodes(editor, { at: path });
      },
    },
  };
};

export function ColumnFloatingToolbar({ children }: { children: React.ReactNode }) {
  const {
    setSingleColumn,
    setDoubleColumn,
    setDoubleSideDoubleColumn,
    setLeftSideDoubleColumn,
    setRightSideDoubleColumn,
    setThreeColumn,
    setStyle,
    setVertAlignment
  } = useColumnState();

  const element = useElement<TColumnElement>(BLOCKS.COLUMN);
  const { props: buttonProps } = useRemoveNodeButton({ element });
  const isOpen = useDebouncePopoverOpen();

  return (
    <Popover isOpen={isOpen} autoFocus={false} placement="top">
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content>
        <div>
          {/* Layout */}
          <Button size="small" variant="transparent" onClick={setSingleColumn}>
            <svg
              width="16px"
              height="16px"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z"
                stroke="#000000"
                strokeWidth="3"
              />
            </svg>
          </Button>
          <Button size="small" variant="transparent" onClick={setDoubleColumn}>
            <svg
              fill="none"
              height="16px"
              viewBox="0 0 16 16"
              width="16px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M8.5 3H13V13H8.5V3ZM7.5 2H8.5H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H8.5H7.5H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H7.5ZM7.5 13H3L3 3H7.5V13Z"
                fill="#000"
                fillRule="evenodd"
              ></path>
            </svg>
          </Button>
          <Button size="small" variant="transparent" onClick={setThreeColumn}>
            <svg
              fill="none"
              height="16px"
              viewBox="0 0 16 16"
              width="16px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M9.25 3H6.75V13H9.25V3ZM9.25 2H6.75H5.75H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H5.75H6.75H9.25H10.25H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2H10.25H9.25ZM10.25 3V13H13V3H10.25ZM3 13H5.75V3H3L3 13Z"
                fill="#000"
                fillRule="evenodd"
              ></path>
            </svg>
          </Button>
          <Button size="small" variant="transparent" onClick={setRightSideDoubleColumn}>
            <svg
              fill="none"
              height="16px"
              viewBox="0 0 16 16"
              width="16px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M11.25 3H13V13H11.25V3ZM10.25 2H11.25H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H11.25H10.25H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H10.25ZM10.25 13H3L3 3H10.25V13Z"
                fill="#000"
                fillRule="evenodd"
              ></path>
            </svg>
          </Button>
          <Button size="small" variant="transparent" onClick={setLeftSideDoubleColumn}>
            <svg
              fill="none"
              height="16px"
              viewBox="0 0 16 16"
              width="16px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M5.75 3H13V13H5.75V3ZM4.75 2H5.75H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H5.75H4.75H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H4.75ZM4.75 13H3L3 3H4.75V13Z"
                fill="#000"
                fillRule="evenodd"
              ></path>
            </svg>
          </Button>
          <Button size="small" variant="transparent" onClick={setDoubleSideDoubleColumn}>
            <svg
              fill="none"
              height="16px"
              viewBox="0 0 16 16"
              width="16px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M10.25 3H5.75V13H10.25V3ZM10.25 2H5.75H4.75H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H4.75H5.75H10.25H11.25H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2H11.25H10.25ZM11.25 3V13H13V3H11.25ZM3 13H4.75V3H3L3 13Z"
                fill="#000"
                fillRule="evenodd"
              ></path>
            </svg>
          </Button>

          {/* Style */}
          <ColumnStyleButton setStyle={setStyle} setAlign={setVertAlignment}/>

          <Button size="small" variant="transparent" {...buttonProps}>
            <DeleteIcon variant="negative" />
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
