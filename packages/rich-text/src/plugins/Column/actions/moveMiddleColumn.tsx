import { Element, Node } from 'slate';

import { unwrapNodes, removeNodes, moveNodes } from '../../../internal';

export function moveMiddleColumn(editor, [node, path], options) {
  const direction = (options == null ? 0 : options.direction) || 'left';
  if (direction === 'left') {
    const DESCENDANT_PATH = [1];
    const middleChildNode = Node.get(node, DESCENDANT_PATH);
    const isEmpty = editor.isEmpty(middleChildNode);
    const middleChildPathRef = editor.pathRef(path.concat(DESCENDANT_PATH));
    if (isEmpty) {
      removeNodes(editor, { at: middleChildPathRef.current });
      return false;
    }

    const firstNode = Node.descendant(node, [0]) as Element;
    const firstLast = path.concat([0, firstNode.children.length]);
    moveNodes(editor, { at: middleChildPathRef.current, to: firstLast });
    unwrapNodes(editor, { at: middleChildPathRef.current });
    middleChildPathRef.unref();
  }
}
