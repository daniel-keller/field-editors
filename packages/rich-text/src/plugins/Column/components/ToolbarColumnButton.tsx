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
      <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 12C12 11.4477 12.4477 11 13 11H19C19.5523 11 20 11.4477 20 12V19C20 19.5523 19.5523 20 19 20H13C12.4477 20 12 19.5523 12 19V12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M4 5C4 4.44772 4.44772 4 5 4H8C8.55228 4 9 4.44772 9 5V19C9 19.5523 8.55228 20 8 20H5C4.44772 20 4 19.5523 4 19V5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M12 5C12 4.44772 12.4477 4 13 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H13C12.4477 8 12 7.55228 12 7V5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> </g></svg>
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 3H3v7h18V3z"></path> <path d="M21 14h-5v7h5v-7z"></path> <path d="M12 14H3v7h9v-7z"></path> </g></svg> */}
    </ToolbarButton>
  );
}
