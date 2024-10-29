
import * as React from 'react';

import { Form, FormControl, TextInput } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import {
  Element,
  RenderElementProps,
  findNodePath,
  setNodes,
} from '../../../internal';
import { WidgetTitle } from '../../shared/WidgetTitle';
import { useSelected } from 'slate-react';


interface FilloutFormElementProps {
  element: Element & {
    data: {
      id?: string
    }
  }
  attributes: Pick<RenderElementProps, 'attributes'>
  children: React.ReactNode
}

export default function FilloutForm(props: FilloutFormElementProps) {
  const { element, attributes, children } = props;
  const editor = useContentfulEditor();
  const isSelected = useSelected();
  const [id, setId] = React.useState<string | undefined>(element.data.id);


  /**
   * Change is Width
   */
  const changeId = React.useCallback((e) => {
    setId(e.target.value);
    const i = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const data = {...element.data, id: i };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  }, [editor, element]);

  const gallery = css({
    margin: '0 0 1.3125rem',
    padding: '10px',
    border: `1px solid ${isSelected ? tokens.blue600 : 'darkgray'}`,
    backgroundColor: `${isSelected ? tokens.blue100 : 'initial'}`,
    borderRadius: '5px',
  });

  return (
    <div {...attributes} className={gallery} contentEditable={false}>
      <div>
        <WidgetTitle title='Fillout Form'/>
        <Form>
          <FormControl>
            <FormControl.Label isRequired>Form ID</FormControl.Label>
            {/* id */}
            <TextInput
              name='id'
              value={id}
              onChange={changeId}
            />
            <FormControl.HelpText>
              Please provide the Fillout Form 12 character form ID.<br />
              The Form ID can be found in the form url:
              <p>https://form.fillout.com/t/<strong>xxxxxxxxxxxx</strong></p>
              <p>https://build.fillout.com/editor/<strong>xxxxxxxxxxxx</strong></p>
            </FormControl.HelpText>
          </FormControl>
        </Form>
      </div>
      {children}
    </div>
  );
}
