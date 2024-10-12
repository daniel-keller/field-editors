import * as React from 'react';

// import { Form, TextInput } from '@contentful/f36-components';
import { css } from 'emotion';

// import { useContentfulEditor } from '../../../ContentfulEditorProvider';
// import { getNodeEntryFromSelection } from '../../../helpers/editor';
import { RenderElementProps } from '../../../internal';
// import { BLOCKS } from '../../../rich-text-types/src';

const quote = css({
  margin: '0 0 1.3125rem',
  border: '1px solid darkgray',
  padding: '10px',
  borderRadius: '5px',
  fontStyle: 'normal',
});

export default function Accordion(props: RenderElementProps) {
//   const { element, attributes, children } = props;
//   const editor = useContentfulEditor();

//   const [attribution, setAttribution] = React.useState<string | undefined>(element.data.attribution);

//   const changeAttribution = (e) => {
//     setAttribution(e.target.value);
//     const [,path] = getNodeEntryFromSelection(editor, BLOCKS.QUOTE);

//     const attribution = e.target.value ? e.target.value : undefined;
//     setNodes(editor, {data: {...element.data, attribution }}, { at: path});
//   }

  return (
    <div {...props.attributes} className={quote}>
      {props.children}
    </div>
  );
}
