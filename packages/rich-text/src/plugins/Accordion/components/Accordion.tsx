import * as React from 'react';

import { css } from 'emotion';
import tokens from '@contentful/f36-tokens';
import { useSelected } from 'slate-react';
import { Button, Stack, Switch } from '@contentful/f36-components';
import { DeleteIcon } from '@contentful/f36-icons';


import { WidgetTitle } from '../../shared/WidgetTitle';
import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import {
  isSelectionAtBlockStart,
  RenderElementProps,
  findNodePath,
  removeNodes,
  setNodes
} from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';

interface AccordionElementProps {
  element: Element & {
    data: {
      defaultOpen?: boolean
    }
  }
  attributes: Pick<RenderElementProps, 'attributes'>
  children: React.ReactNode
}

export default function Accordion(props: AccordionElementProps) {
  const { element, attributes } = props;
  const { defaultOpen } = element.data;

  const editor = useContentfulEditor();
  const startOfAnySelected = isSelectionAtBlockStart(editor, {
    match: (n) => n.type == BLOCKS.ACCORDION
  });
  const thisStartSelected = useSelected() && startOfAnySelected;

  const [isDefaultOpen, setIsDefaultOpen] = React.useState<boolean>(defaultOpen ?? false);

  /**
   * Delete Accordion
   */
    const deleteAccordion = React.useCallback(() => {
      const path = findNodePath(editor, element as any);
      removeNodes(editor, {at: path});
    }, [editor, element]);

    /**
     * set open by default
     */
    const setDefaultOpen = React.useCallback((e) => {
      setIsDefaultOpen(e.target.checked);
      const d = e.target.checked ? true : undefined;

      const path = findNodePath(editor, element as any);
      setNodes(editor, {data: {...element.data, defaultOpen: d }}, { at: path});
    }, [editor, element]);


  const accordion = css({
    margin: '0 0 1.3125rem',
    border: `1px solid ${thisStartSelected ? tokens.blue600 : 'darkgray'}`,
    backgroundColor: `${thisStartSelected ? tokens.blue100 : 'initial'}`,
    padding: '10px',
    borderRadius: '5px',
    fontStyle: 'normal',
  });

  return (
    <div {...attributes} className={accordion}>
      <Stack flex='row' justifyContent='space-between' contentEditable={false}>
        <WidgetTitle title='Accordion'/>
        <Stack flex='row'>
          <Switch
            isChecked={isDefaultOpen}
            onChange={setDefaultOpen}
          >
            Open by default
          </Switch>
          <Button size="small" variant="transparent" onClick={deleteAccordion}>
            <DeleteIcon variant="negative" />
          </Button>
        </Stack>
      </Stack>
      {props.children}
    </div>
  );
}
