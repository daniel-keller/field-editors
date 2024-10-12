import { WithOverride } from '../../internal/types';
// import { insertAccordion } from './insertAccordion';
// import { normalizeAccordion } from './normalizeAccordion';

export const withAccordion: WithOverride = (editor) => {
  // editor.insertFragment = insertAccordion(editor);
  // editor.normalizeNode = normalizeAccordion(editor);

  return editor;
};
