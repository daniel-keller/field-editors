import * as React from 'react';

import { Link } from '@contentful/app-sdk';
import { css } from 'emotion';

import { focus } from '../../../helpers/editor';
import { Element, PlateEditor } from '../../../internal/types';
import { Icons } from '../IconPopover';

type UrlHyperlinkProps = {
  element: Element & {
    data: {
      uri?: string;
      target: {
        sys: {
          id: string;
          linkType: 'Entry' | 'Asset';
          type: 'Link';
        };
      };
    };
  };
  target?: Link;
  onEntityFetchComplete?: VoidFunction;
  children: React.ReactNode;
  editor?: PlateEditor;
};

/**
 * Given Hex code caluculate text color of white or black (ratio of 4.3)
 * @returns
 */
function getContrastTextColor(hex) {
  // Convert hex to RGB
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);

  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Calculate contrast ratios
  const whiteContrast = 1.05 / (luminance + 0.05);
  const blackContrast = (luminance + 0.05) / 0.05;

  // Return the text color with the highest contrast ratio
  return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
}

export default function WrappedLinkButton(props: UrlHyperlinkProps) {
  const size = props.element.data?.size as string | undefined;
  const variant = props.element.data?.variant as string | undefined;
  const color = props.element.data?.color;
  const leadingIcon: string | undefined = props.element.data?.leadingIcon as string | undefined;
  const trailingIcon = props.element.data?.trailingIcon as string | undefined;

  const config: any = {
    cursor: 'inherit',
    maxWidth: 'unset',
    boxShadow: 'none',
    borderRadius: '5px',
    // variant contained/filled
    border: 'none',
    // size large
    fontSize: '15px',
    padding: '8px 22px',
  };

  const svgSize = {
    width: '20px',
  };

  if (color) {
    config.backgroundColor = color;
    config.borderColor = color;
    config.color = getContrastTextColor(color);
  }

  // styles
  if (size == 'medium') {
    config.fontSize = '13px';
    config.padding = '6px 16px';
    svgSize.width = '15px';
  }
  if (size == 'small') {
    config.fontSize = '13px';
    config.padding = '4px 10px';
    svgSize.width = '15px';
  }

  // variants
  if (variant == 'outlined') {
    config.background = 'none';
    config.border = '1px solid black';
  }
  if (variant == 'text') {
    config.background = 'none';
    config.border = 'none';
    config.color = color;
  }

  const styles = css(config);
  const wrapper = css({
    display: 'flex !important',
    alignItems: 'center',
    gap: '3px',
  });
  const icons = css({
    height: '24px',
    '& svg': svgSize,
  });

  return (
    <button
      className={styles}
      onClick={(e) => {
        e.preventDefault();
        if (props.editor) focus(props.editor);
      }}
    >
      <span className={wrapper}>
        {leadingIcon && <span className={icons}>{Icons[leadingIcon]}</span>}
        {props.children}
        {trailingIcon && <span className={icons}>{Icons[trailingIcon]}</span>}
      </span>
    </button>
  );
}
