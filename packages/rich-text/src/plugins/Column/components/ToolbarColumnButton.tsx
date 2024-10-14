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
      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 3H3v7h18V3z"></path> <path d="M21 14h-5v7h5v-7z"></path> <path d="M12 14H3v7h9v-7z"></path> </g></svg>
    </ToolbarButton>
  );
}
