import { isCollapsed, isStartPoint } from '@udecode/plate-common';
import {
  createColumnPlugin as createDefaultColumnPlugin,
  ELEMENT_COLUMN,
  ELEMENT_COLUMN_GROUP,
} from '@udecode/plate-layout';

import { getAboveNode, isElement, PlatePlugin } from '../../internal';
import { BLOCKS } from '../../rich-text-types/src';
import { onKeyDownColumn } from './actions';
import { normalizeColumn } from './actions/normalizeColumn';
import { ColumnElement } from './components/ColumnElement';
import { ColumnGroupElement } from './components/ColumnGroup';

export const createColumnPlugin = (): PlatePlugin =>
  createDefaultColumnPlugin({
    type: BLOCKS.COLUMN_GROUP,
    handlers: {
      onKeyDown: onKeyDownColumn,
    },
    withOverrides: (editor) => {
      const { deleteBackward, isEmpty } = editor;
      editor.normalizeNode = normalizeColumn(editor);

      editor.deleteBackward = (unit) => {
        if (isCollapsed(editor.selection)) {
          const entry = getAboveNode(editor, {
            match: (n) => isElement(n) && n.type === BLOCKS.COLUMN,
          });

          if (entry) {
            const [node, path] = entry;
            if (Array.isArray(node.children) && node.children.length > 1)
              return deleteBackward(unit);

            const isStart = isStartPoint(
              editor,
              editor.selection == null ? undefined : editor.selection.anchor,
              path
            );
            if (isStart) return;
          }
        }

        deleteBackward(unit);
      };

      editor.isEmpty = (element: any) => {
        if (element?.type === BLOCKS.COLUMN) {
          return element.children.length === 1 && isEmpty(element.children[0]);
        }
        return isEmpty(element);
      };
      return editor;
    },
    overrideByKey: {
      [ELEMENT_COLUMN]: {
        type: BLOCKS.COLUMN,
        component: ColumnElement,
      },
      [ELEMENT_COLUMN_GROUP]: {
        type: BLOCKS.COLUMN_GROUP,
        component: ColumnGroupElement,
      },
    },
  });
