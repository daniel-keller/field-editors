import React from 'react';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { focus, isBlockSelected } from '../../../helpers/editor';
import { ToolbarButton } from '../../shared/ToolbarButton';
import { addIFrame } from '../addIFrame';
import { BLOCKS } from '../../../rich-text-types/src';

export interface ToolbarIFrameButtonProps {
  isDisabled: boolean | undefined;
}

export function ToolbarIFrameButton(props: ToolbarIFrameButtonProps) {
  const editor = useContentfulEditor();

  async function handleClick() {
    if (!editor) return;
    editor.tracking.onToolbarAction('insertIFrame');

    if (editor.selection) {
      addIFrame(editor);
    }
    focus(editor);
  }

  if (!editor) return null;

  return (
    <ToolbarButton
      title="iFrame"
      testId="iframe-toolbar-button"
      onClick={handleClick}
      isActive={isBlockSelected(editor, BLOCKS.IFRAME)}
      isDisabled={props.isDisabled}
    >
      <svg height="18px" width="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 10V18C3 19.1046 3.89543 20 5 20H9M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10M3 10H21M21 10V13" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15 16L13 18L15 20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M19 16L21 18L19 20" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <circle cx="6" cy="7" r="1" fill="#000000"></circle> <circle cx="9" cy="7" r="1" fill="#000000"></circle> </g></svg>
    </ToolbarButton>
  );
}
