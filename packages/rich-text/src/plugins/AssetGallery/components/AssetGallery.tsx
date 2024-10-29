
import * as React from 'react';

import { FieldAppSDK } from '@contentful/app-sdk';
import { Button, Form, Stack, Switch, TextInput } from '@contentful/f36-components';
import { DeleteIcon } from '@contentful/f36-icons';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

import { useContentfulEditor } from '../../../ContentfulEditorProvider';
import {
  Element,
  RenderElementProps,
  insertNodes,
  setNodes,
  getLastChildPath,
  findNodePath,
  removeNodes,
  NodeEntry,
  getNodeEntry,
} from '../../../internal';
import { BLOCKS } from '../../../rich-text-types/src';
import AddMoreAssetsButton from './AddMoreAssetsButton';
import { useSdkContext } from '../../../SdkProvider';
import { selectEntityAndInsert } from '../../shared/EmbeddedBlockUtil';
import { WidgetTitle } from '../../shared/WidgetTitle';
import { useSelected } from 'slate-react';


interface AssetGalleryElementProps {
  element: Element & {
    data: {
      title?: string
      collapsible?: boolean
      slideshow?: boolean
    }
  }
  attributes: Pick<RenderElementProps, 'attributes'>
  children: React.ReactNode
}

const cards = css({
  marginTop: '1em'
});

const form = css({
  marginBottom: '5px'
});

export default function AssetGallery(props: AssetGalleryElementProps) {
  const { element, attributes, children } = props;
  const editor = useContentfulEditor();
  const isSelected = useSelected();
  const sdk: FieldAppSDK = useSdkContext();
  const [title, setTitle] = React.useState<string | undefined>(element.data.title);
  const [collapsible, setCollapsible] = React.useState<boolean>(element.data.collapsible ?? false);
  const [isSlideshow, setIsSlideshow] = React.useState<boolean>(element.data.slideshow ?? false);

  /**
   * Change is Slideshow
   */
  const changeSlideshow = React.useCallback((e) => {
    setIsSlideshow(e.target.checked);
    const s = e.target.checked ? true : undefined;
    const data = {...element.data, slideshow: s };

    // can't set collapsible if slideshow is true
    if (s) {
      setCollapsible(false);
      data.collapsible = undefined;
    }

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  }, [editor, element]);

  /**
   * Change Collapsability
   */
  const changeCollapsible = React.useCallback((e) => {
    setCollapsible(e.target.checked);
    const c = e.target.checked ? true : undefined;
    const data = {...element.data, collapsible: c };

    // can't set slideshow if collapsible is true
    if (c) {
      setIsSlideshow(false);
      data.slideshow = undefined;
    }

    const path = findNodePath(editor, element);
    setNodes(editor, {data: data}, { at: path});
  }, [editor, element]);

  /**
   * Change Title
   */
  const changeTitle = React.useCallback((e) => {
    setTitle(e.target.value);
    const t = e.target.value.trim() == '' ? undefined : e.target.value.trim();
    const path = findNodePath(editor, element);

    setNodes(editor, {data: {...element.data, title: t }}, { at: path});
  }, [editor, element]);

  /**
   * Add Assets
   */
  const addMore = React.useCallback(async () => {
    const assets = await selectEntityAndInsert(
      BLOCKS.EMBEDDED_ASSET,
      sdk,
      editor,
      editor.tracking.onToolbarAction,
      true
    );

    if (!assets) return;

    // Find this specific asset gallery block's last child
    const path = findNodePath(editor, element);
    if (path) {
      const nodeEntry = getNodeEntry(editor, path) as NodeEntry;

      // TODO: this is inserting before last child instead of after?
      if (nodeEntry) {
        const lastChildPath = getLastChildPath(nodeEntry);
        insertNodes(editor, assets, {at: lastChildPath});
      }
    }
  }, [editor, sdk, element]);

  /**
   * Delete Gallery
   */
  const deleteGallery = React.useCallback(() => {
    const path = findNodePath(editor, element);
    removeNodes(editor, {at: path});
  }, [editor, element]);

  const gallery = css({
    margin: '0 0 1.3125rem',
    padding: '5px',
    border: `1px solid ${isSelected ? tokens.blue600 : 'darkgray'}`,
    backgroundColor: `${isSelected ? tokens.blue100 : 'initial'}`,
    borderRadius: '5px',
    '& [data-entity-type="Asset"]': {
      display: 'inline-block !important',
      margin: '5px'
    }
  });

  return (
    <div {...attributes} className={gallery} contentEditable={false}>
      <div>
        <Stack flex='row' justifyContent='space-between'>
          <WidgetTitle title='Image Gallery'/>
          <Button size="small" variant="transparent" onClick={deleteGallery}>
            <DeleteIcon variant="negative" />
          </Button>
        </Stack>
        <Form>
          {/* Title */}
          <TextInput
            name='title'
            placeholder='Title'
            value={title}
            onChange={changeTitle}
            className={form}
          />
          {/* variant */}
          <Stack flex='row' spacing='spacingXl'>
          <Switch
            name="slideshow"
            id="slideshow"
            isChecked={isSlideshow}
            onChange={changeSlideshow}
          >
            Display as slideshow
          </Switch>

          <Switch
            name="collapsible"
            id="collapsible"
            isChecked={collapsible}
            onChange={changeCollapsible}
            className={form}
          >
            Collapsible grid
          </Switch>
          </Stack>
        </Form>
      </div>
      <div className={cards}>
        {children}
      </div>
      <AddMoreAssetsButton onClick={addMore}/>
    </div>
  );
}
