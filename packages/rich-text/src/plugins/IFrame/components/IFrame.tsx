
import * as React from 'react';

import { Form, FormControl, IconButton, Stack, TextInput } from '@contentful/f36-components';
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


interface IFrameElementProps {
  element: Element & {
    data: {
      url?: string
      height?: HeightSet
      width?: number
    }
  }
  attributes: Pick<RenderElementProps, 'attributes'>
  children: React.ReactNode
}

const input = css({
  width: '100%',
});
const form = css({
  width: '100%',
  marginBottom: '5px'
});

interface HeightSet {
  xs?: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
}


export default function IFrame(props: IFrameElementProps) {
  const { element, attributes, children } = props;
  const editor = useContentfulEditor();
  const isSelected = useSelected();
  const [url, setUrl] = React.useState<string | undefined>(element.data.url);
  const [xsHeight, setXsHeight] = React.useState<string>(element.data.height?.xs ?? '');
  const [smHeight, setSmHeight] = React.useState<string>(element.data.height?.sm ?? '');
  const [mdHeight, setMdHeight] = React.useState<string>(element.data.height?.md ?? '');
  const [lgHeight, setLgHeight] = React.useState<string>(element.data.height?.lg ?? '');
  const [xlHeight, setXlHeight] = React.useState<string>(element.data.height?.xl ?? '');
  const [width, setWidth] = React.useState<string | undefined>(
    element.data.width
      ? String(element.data.width)
      : undefined
  );

  /**
   * Builds height set from screen sizes. If all are undefined return undefined
   * @returns
   */
  const generateHeightset = (name: string, size?: string) => {
    const set = {
      xs: xsHeight.trim() == '' ? undefined : xsHeight,
      sm: smHeight.trim() == '' ? undefined : smHeight,
      md: mdHeight.trim() == '' ? undefined : mdHeight,
      lg: lgHeight.trim() == '' ? undefined : lgHeight,
      xl: xlHeight.trim() == '' ? undefined : xlHeight,
    }
    set[name] = size;
    return Object.values(set).every(v => v === undefined) ? undefined : set;
  };


  /**
   * Change is Width
   */
  const changeWidth = React.useCallback((e) => {
    setWidth(e.target.value);
    const w = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const data = {...element.data, width: w };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  }, [editor, element]);


  /**
   * Change XS Height
   */
  const changeXsHeight = (e) => {
    setXsHeight(e.target.value);
    const h = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const height = generateHeightset('xs', h);
    const data = {...element.data, height };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  };

  /**
   * Change SM Height
   */
  const changeSmHeight = (e) => {
    setSmHeight(e.target.value);
    const h = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const height = generateHeightset('sm', h);
    const data = {...element.data, height };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  };


  /**
   * Change MD Height
   */
  const changeMdHeight = (e) => {
    setMdHeight(e.target.value);
    const h = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const height = generateHeightset('md', h);
    const data = {...element.data, height };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  };

  /**
   * Change LG Height
   */
  const changeLgHeight = (e) => {
    setLgHeight(e.target.value);
    const h = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const height = generateHeightset('lg', h);
    const data = {...element.data, height };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  };

  /**
   * Change XL Height
   */
  const changeXlHeight = (e) => {
    setXlHeight(e.target.value);
    const h = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const height = generateHeightset('xl', h);
    const data = {...element.data, height };

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  };

  /**
   * Change Url
   */
  const changeUrl = React.useCallback((e) => {
    setUrl(e.target.value);
    const t = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const path = findNodePath(editor, element);

    setNodes(editor, {data: {...element.data, url: t }}, { at: path});
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
        <WidgetTitle title='iFrame'/>
        <Form>
          <Stack flexDirection='column' alignItems='start' justifyContent='stretch'>
            <FormControl className={input}>
              <FormControl.Label isRequired>Url</FormControl.Label>
              {/* Url */}
              <TextInput
                name='url'
                placeholder='Url'
                type='url'
                value={url}
                onChange={changeUrl}
              />
              <FormControl.HelpText>
                A protocol may be required, e.g. https://
              </FormControl.HelpText>
            </FormControl>

            {/* width */}
            <FormControl className={input}>
              <FormControl.Label>Width</FormControl.Label>
              <TextInput.Group>
                <TextInput
                  name='width'
                  placeholder='Width in pixels'
                  type='number'
                  value={width}
                  onChange={changeWidth}
                />
                <IconButton aria-label='pixels only' icon={<>px</>} isDisabled variant='secondary'/>
              </TextInput.Group>
              <FormControl.HelpText>
                If no width is given, full width is assumed.
              </FormControl.HelpText>
            </FormControl>

            <FormControl className={input}>
              <FormControl.Label>Height</FormControl.Label>
              {/* xs */}
              <TextInput.Group className={form}>
                <TextInput
                  name='heightXs'
                  placeholder='extra small screens'
                  type='number'
                  value={xsHeight}
                  onChange={changeXsHeight}
                  />
                <IconButton aria-label='pixels only' icon={<>px</>} isDisabled variant='secondary'/>
              </TextInput.Group>
              {/* sm */}
              <TextInput.Group className={form}>
                <TextInput
                  name='heightSm'
                  placeholder='small screens'
                  type='number'
                  value={smHeight}
                  onChange={changeSmHeight}
                  />
                <IconButton aria-label='pixels only' icon={<>px</>} isDisabled variant='secondary'/>
              </TextInput.Group>
              {/* md */}
              <TextInput.Group className={form}>
                <TextInput
                  name='heightMd'
                  placeholder='medium screens'
                  type='number'
                  value={mdHeight}
                  onChange={changeMdHeight}
                  />
                <IconButton aria-label='pixels only' icon={<>px</>} isDisabled variant='secondary'/>
              </TextInput.Group>
              {/* lg */}
              <TextInput.Group className={form}>
                <TextInput
                  name='heightLg'
                  placeholder='large screens'
                  type='number'
                  value={lgHeight}
                  onChange={changeLgHeight}
                  />
                <IconButton aria-label='pixels only' icon={<>px</>} isDisabled variant='secondary'/>
              </TextInput.Group>
              {/* xl */}
              <TextInput.Group>
                <TextInput
                  name='heightXl'
                  placeholder='extra large screens'
                  type='number'
                  value={xlHeight}
                  onChange={changeXlHeight}
                  />
                <IconButton aria-label='pixels only' icon={<>px</>} isDisabled variant='secondary'/>
              </TextInput.Group>
              <FormControl.HelpText>
                Because the content of an iframe is dynamic the height of the frame must be set in advance per screen size.
                If no height is given, full height of the screen is assumed.
              </FormControl.HelpText>
            </FormControl>
          </Stack>
        </Form>
      </div>
      {children}
    </div>
  );
}
