import { insertNodes, isElement } from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';

export function normalizeAccordion(editor) {
  const { normalizeNode } = editor;

  return function (entry) {
    const [node, path] = entry;


    // If node is Accordion title and its not the first child
    // of an accordion change it to a paragraph
    // if (isElement(node) && node.type === BLOCKS.ACCORDION_TITLE && isFirstChild(path)) {
    //   const [parentNode] = getParentNode(editor, path);
    //   if (parentNode.type != BLOCKS.ACCORDION) {

    //   }
    // }


    if (isElement(node) && node.type === BLOCKS.ACCORDION) {

      const newtitle = {
        type: BLOCKS.ACCORDION_TITLE,
        children: [{ text: 'Untitled' }],
      };

      // First Child node must be the Accordion Title
      if (node.children[0]?.type != BLOCKS.ACCORDION_TITLE) {
        insertNodes(editor, newtitle, {
          at: path.concat(0),
          select: true,
        });
      }

      // if (path.length === 0 ) {
      //   if (node.children.length <= 1 && getText(editor, [0, 0]) === '') {
      //     const title = {
      //       type: BLOCKS.ACCORDION_TITLE,
      //       children: [{ text: 'Untitled' }],
      //     };

      //     insertNodes(editor, title, {
      //       at: path.concat(0),
      //       select: true,
      //     });
      //   }

      //   if (node.children.length < 2) {
      //     const paragraph = {
      //       type: BLOCKS.PARAGRAPH,
      //       children: [{ text: '' }],
      //     };

      //     insertNodes(editor, paragraph, { at: path.concat(1) });
      //   }

      //   for (const [child, childPath] of getChildren(entry)) {
      //     let type: string;
      //     const slateIndex = childPath[0];
      //     const enforceType = type => {
      //       if (isElement(child) && child.type !== type) {
      //         const newProperties = { type };
      //         setNodes(editor, newProperties, { at: childPath });
      //       }
      //     }

      //     switch (slateIndex) {
      //       case 0:
      //         type = BLOCKS.ACCORDION_TITLE;
      //         enforceType(type);
      //         break;
      //       case 1:
      //         type = BLOCKS.PARAGRAPH;
      //         enforceType(type);
      //         break;
      //       default:
      //         break;
      //     }
      //   }
      // }
    }

    return normalizeNode(entry);
  };
}
