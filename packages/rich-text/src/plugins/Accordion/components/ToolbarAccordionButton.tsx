import React from 'react';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import { focus, isBlockSelected } from '../../../helpers/editor';
import { ToolbarButton } from '../../shared/ToolbarButton';
import { toggleAccordion } from '../toggleAccordion';
import { BLOCKS } from '../../../rich-text-types/src';

export interface ToolbarAccordionButtonProps {
  isDisabled: boolean | undefined;
}

export function ToolbarAccordionButton(props: ToolbarAccordionButtonProps) {
  const editor = useContentfulEditor();

  async function handleClick() {
    if (!editor) return;
    editor.tracking.onToolbarAction('insertAccordion');

    if (editor.selection) {
      toggleAccordion(editor);
    }
    focus(editor);
  }

  if (!editor) return null;

  return (
    <ToolbarButton
      title="Accordion"
      testId="accordion-toolbar-button"
      onClick={handleClick}
      isActive={isBlockSelected(editor, BLOCKS.ACCORDION)}
      isDisabled={props.isDisabled}
    >
      <svg height="18px" width="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(90)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 19.382V5.72076C3 5.29033 3.27543 4.90819 3.68377 4.77208L8.36754 3.21082C8.77808 3.07397 9.22192 3.07397 9.63246 3.21082L14.3675 4.78918C14.7781 4.92603 15.2219 4.92603 15.6325 4.78918L19.6838 3.43874C20.3313 3.2229 21 3.70487 21 4.38743V17.382C21 17.7607 20.786 18.107 20.4472 18.2764L15.8944 20.5528C15.3314 20.8343 14.6686 20.8343 14.1056 20.5528L9.89443 18.4472C9.33137 18.1657 8.66863 18.1657 8.10557 18.4472L4.44721 20.2764C3.78231 20.6088 3 20.1253 3 19.382Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M15 5V20.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 4L9 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
    </ToolbarButton>
  );
}
