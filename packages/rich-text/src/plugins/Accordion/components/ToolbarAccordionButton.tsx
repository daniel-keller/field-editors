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
      <svg fill="#000000" height="25px" width="25px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M14.75 5.9V3.49L11 2.5 9.44 3 8 2.51 6.57 3 5 2.5l-2.82.75a1.24 1.24 0 0 0-.93 1.2V5.9A1.25 1.25 0 0 0 0 7.15v1.5A1.25 1.25 0 0 0 1.25 9.9v1.65a1.24 1.24 0 0 0 .93 1.2L5 13.5l1.57-.45 1.43.44 1.43-.44 1.57.45 3.75-1V9.9A1.25 1.25 0 0 0 16 8.65v-1.5a1.25 1.25 0 0 0-1.25-1.25zm-11 6-1.25-.35v-7.1l1.25-.33zm1.25.3V3.8l1 .27v7.86zm2.21-.26V4.06L8 3.82l.79.24v7.88l-.79.24zm2.84 0V4.07L11 3.8v8.4zm3.45-.38-1.25.33V4.12l1.25.33z"></path></g></svg>
    </ToolbarButton>
  );
}
