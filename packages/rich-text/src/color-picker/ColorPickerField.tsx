import React, { useMemo, useRef, useState } from 'react';

import { Form, Menu } from '@contentful/f36-components';
// import { Form, Flex, Menu } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';
import { css } from 'emotion';

// import { ColorBox } from './components/ColorBox';
import { SelectColorButton } from './components/SelectColorButton';
import { Theme } from './types';
// import { Color, Theme } from './types';

const styles = {
  displayNone: css({
    display: 'none',
  }),
  menuList: css({
    width: 'calc(100% - 2px)', // -2px to keep borders visible
    left: 0,
  }),
  hexValue: css({
    color: tokens.gray500,
    fontVariantNumeric: 'tabular-nums',
    width: '70px',
    display: 'inline-block',
    textAlign: 'left',
  }),
};

// Dropdown + margin top + box shadow
// type FieldValue = Color | string | undefined;
type FieldValue = string | undefined;

interface Props {
  color: FieldValue;
  onChange: (color: FieldValue) => void;
}

const ColorPickerField = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<FieldValue>(props.color);
  const customColorPicker = useRef<HTMLInputElement>(null);

  // const storeHexValue = true;
  // const storeHexValue = sdk.field.type === 'Symbol';

  // Accepts custom Colors?
  const allowCustomValue = true;
  // const allowCustomValue = useMemo(() => {
  //   const { validations } = sdk.field;

  //   const instanceParam = sdk.parameters.instance.withCustomValue;
  //   const hasValidation = validations.find((validation) => validation.in)?.in;

  //   return instanceParam && !hasValidation;
  // }, [sdk.field, sdk.parameters.instance]);

  const theme: Theme = { id: 'test', name: 'test', colors: [] };
  // const theme: Theme = sdk.parameters.installation.themes[0];

  // // Color validator
  // const validatedColors = useMemo(() => {
  //   // const { validations } = sdk.field;

  //   const acceptedValues = [];
  //   // const acceptedValues = validations.find((validation) => validation.in)?.in;

  //   if (acceptedValues?.at(0) && theme.colors?.at(0)) {
  //     // @ts-expect-error --
  //     return theme.colors.filter((color) => acceptedValues?.includes(color.value));
  //   }

  //   return theme.colors;
  // }, [theme.colors]);
  // }, [sdk.field, theme.colors]);

  // Name of value
  const name = useMemo<string>(() => {
    switch (typeof value) {
      case 'string':
        // eslint-disable-next-line no-case-declarations -- I said so
        const color = theme.colors.find((c) => c.value === value);
        if (color) {
          return color.name;
        }

        if (allowCustomValue) {
          return 'Custom';
        } else {
          return 'Invalid';
        }

      // case 'object':
      //   return value.name;

      case 'undefined':
        return 'Select a color…';

      default:
        return 'Invalid';
    }
  }, [allowCustomValue, theme.colors, value]);

  const changeColor = (color: FieldValue) => {
    setValue(color);
    props.onChange(color);
  };

  return (
    <Form>
      {theme.colors.length === 0 ? (
        <SelectColorButton
          name={name}
          value={value}
          onClick={() => customColorPicker?.current?.click()}
          onClearClick={() => changeColor(undefined)}
        />
      ) : (
        <Menu isOpen={isOpen} onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
          <Menu.Trigger>
            <SelectColorButton
              showChevron
              name={name}
              value={value}
              onClearClick={() => changeColor(undefined)}
            />
          </Menu.Trigger>
          <Menu.List className={styles.menuList}>
            {/* {validatedColors.map((color: Color) => (
              <Menu.Item
                key={color.id}
                onClick={() => changeColor(storeHexValue ? color.value : color)}>
                <Flex alignItems="center" gap="spacingXs">
                  <ColorBox color={color} />
                  <Flex gap="spacing2Xs">
                    {color.name}
                    <span className={styles.hexValue}>{color.value}</span>
                  </Flex>
                </Flex>
              </Menu.Item>
            ))} */}
            {/* {allowCustomValue && ( */}
            <Menu.Item onClick={() => customColorPicker?.current?.click()}>Custom...</Menu.Item>
            {/* )} */}
          </Menu.List>
        </Menu>
      )}
      <input
        onChange={(e) => {
          changeColor(e.target.value);
          // if (storeHexValue) {
          // } else {
          //   changeColor({
          //     id: window.crypto.randomUUID(),
          //     name: 'Custom',
          //     value: e.target.value,
          //   });
          // }
        }}
        type="color"
        id="customColor"
        className={styles.displayNone}
        ref={customColorPicker}
      />
    </Form>
  );
};

export default ColorPickerField;
