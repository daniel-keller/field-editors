import React from 'react';


import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { focus } from '../../../helpers/editor';
import { getBlockAbove, getStartPoint, selectEditor } from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';
import { ToolbarButton } from '../../shared/ToolbarButton';
import { insertColumnGroup } from '../actions';

export interface ToolbarColumnButtonProps {
  isDisabled: boolean | undefined;
}

export function ToolbarColumnButton(props: ToolbarColumnButtonProps) {
  const editor = useContentfulEditor();
  // const isActive = editor && isColumnActive(editor);

  async function handleClick() {
    if (!editor) return;
    editor.tracking.onToolbarAction('insertColumns');

    insertColumnGroup(editor);

    if (editor.selection) {
      const columnEntry = getBlockAbove(editor, {
        match: { type: BLOCKS.COLUMN_GROUP },
      });
      if (!columnEntry) return;

      selectEditor(editor, { at: getStartPoint(editor, columnEntry[1]) });
    }
    focus(editor);
  }

  if (!editor) return null;

  return (
    <ToolbarButton
      title="Column Layout"
      testId="column-toolbar-button"
      onClick={handleClick}
      // isActive={!!isActive}
      isDisabled={props.isDisabled}
    >
      <svg
        fill="#000000"
        width="18px"
        height="18px"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Grid_3-2">
          <g>
            <g>
              <path d="M18.437,11H12.566a2.5,2.5,0,0,1-2.5-2.5V5.564a2.5,2.5,0,0,1,2.5-2.5h5.871a2.5,2.5,0,0,1,2.5,2.5V8.5A2.5,2.5,0,0,1,18.437,11ZM12.566,4.064a1.5,1.5,0,0,0-1.5,1.5V8.5a1.5,1.5,0,0,0,1.5,1.5h5.871a1.5,1.5,0,0,0,1.5-1.5V5.564a1.5,1.5,0,0,0-1.5-1.5Z" />
              <path d="M5.565,11a2.5,2.5,0,0,1-2.5-2.5V5.564a2.5,2.5,0,1,1,5,0V8.5A2.5,2.5,0,0,1,5.565,11Zm0-6.934a1.5,1.5,0,0,0-1.5,1.5V8.5a1.5,1.5,0,0,0,3,0V5.564A1.5,1.5,0,0,0,5.565,4.064Z" />
            </g>
            <path d="M18.437,20.936H5.565a2.5,2.5,0,0,1-2.5-2.5V15.5a2.5,2.5,0,0,1,2.5-2.5H18.437a2.5,2.5,0,0,1,2.5,2.5v2.934A2.5,2.5,0,0,1,18.437,20.936ZM5.565,14a1.5,1.5,0,0,0-1.5,1.5v2.934a1.5,1.5,0,0,0,1.5,1.5H18.437a1.5,1.5,0,0,0,1.5-1.5V15.5a1.5,1.5,0,0,0-1.5-1.5Z" />
          </g>
        </g>
      </svg>
    </ToolbarButton>
  );
}
