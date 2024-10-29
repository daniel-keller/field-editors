import * as React from 'react';

import { Button, Menu } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';

interface Props {
  setAlign: (align?: string) => void
  setStyle: (style?: string) => void
}

export const ColumnStyleButton = (props: Props) => {

  return (
    <Menu>
      <Menu.Trigger>
        <Button
          size="small"
          variant="transparent"
          endIcon={<ChevronDownIcon />}
          aria-label="toggle menu"
        >
          <svg width='16px' height='16px' viewBox="0 -2 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>brush</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Icon-Set" transform="translate(-99.000000, -154.000000)" fill="#000000"> <path d="M128.735,157.585 L116.047,170.112 L114.65,168.733 L127.339,156.206 C127.725,155.825 128.35,155.825 128.735,156.206 C129.121,156.587 129.121,157.204 128.735,157.585 L128.735,157.585 Z M112.556,173.56 C112.427,173.433 111.159,172.181 111.159,172.181 L113.254,170.112 L114.65,171.491 L112.556,173.56 L112.556,173.56 Z M110.461,178.385 C109.477,179.298 105.08,181.333 102.491,179.36 C102.491,179.36 103.392,178.657 104.074,177.246 C105.703,172.919 109.763,173.56 109.763,173.56 L111.159,174.938 C111.173,174.952 112.202,176.771 110.461,178.385 L110.461,178.385 Z M130.132,154.827 C128.975,153.685 127.099,153.685 125.942,154.827 L108.764,171.788 C106.661,171.74 103.748,172.485 102.491,176.603 C101.53,178.781 99,178.671 99,178.671 C104.253,184.498 110.444,181.196 111.857,179.764 C113.1,178.506 113.279,176.966 113.146,175.734 L130.132,158.964 C131.289,157.821 131.289,155.969 130.132,154.827 L130.132,154.827 Z" id="brush"> </path> </g> </g> </g></svg>
        </Button>
      </Menu.Trigger>
      <Menu.List>
        <Menu.Submenu>
          <Menu.SubmenuTrigger>Style</Menu.SubmenuTrigger>
          <Menu.List>
            <Menu.Item onClick={() => props.setStyle('filled')}>Filled</Menu.Item>
            <Menu.Item onClick={() => props.setStyle('outlined')}>Outlined</Menu.Item>
            <Menu.Item onClick={() => props.setStyle()}>None</Menu.Item>
          </Menu.List>
        </Menu.Submenu>
        <Menu.Submenu>
          <Menu.SubmenuTrigger>Vertical Aligment</Menu.SubmenuTrigger>
          <Menu.List>
            <Menu.Item onClick={() => props.setAlign()}>
              <svg width='16px' height='16px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 3L3 3M15.5 7V7C15.2239 7 15 7.22386 15 7.5L15 14.5C15 14.7761 15.2239 15 15.5 15V15C15.7761 15 16 14.7761 16 14.5L16 7.5C16 7.22386 15.7761 7 15.5 7ZM8.5 7V7C8.22386 7 8 7.22386 8 7.5V20.5C8 20.7761 8.22386 21 8.5 21V21C8.77614 21 9 20.7761 9 20.5V7.5C9 7.22386 8.77614 7 8.5 7Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              Top
            </Menu.Item>
            <Menu.Item onClick={() => props.setAlign('center')}>
              <svg width='16px' height='16px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 12L3 12M15.5 7V7C15.2239 7 15 7.22386 15 7.5L15 16.5C15 16.7761 15.2239 17 15.5 17V17C15.7761 17 16 16.7761 16 16.5L16 7.5C16 7.22386 15.7761 7 15.5 7ZM8.5 4V4C8.22386 4 8 4.22386 8 4.5V19.5C8 19.7761 8.22386 20 8.5 20V20C8.77614 20 9 19.7761 9 19.5V4.5C9 4.22386 8.77614 4 8.5 4Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              Center
            </Menu.Item>
            <Menu.Item onClick={() => props.setAlign('bottom')}>
              <svg width='16px' height='16px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 21L3 21M15.5 17V17C15.2239 17 15 16.7761 15 16.5L15 9.5C15 9.22386 15.2239 9 15.5 9V9C15.7761 9 16 9.22386 16 9.5L16 16.5C16 16.7761 15.7761 17 15.5 17ZM8.5 17V17C8.22386 17 8 16.7761 8 16.5V3.5C8 3.22386 8.22386 3 8.5 3V3C8.77614 3 9 3.22386 9 3.5V16.5C9 16.7761 8.77614 17 8.5 17Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              Bottom
            </Menu.Item>
          </Menu.List>
        </Menu.Submenu>
      </Menu.List>
    </Menu>
  );
};
