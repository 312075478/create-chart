import { useState, useCallback, useEffect, useRef } from 'react';
import { Input as AntInput } from 'antd';
import { InputProps } from 'antd/es/input';
import { useUnmount } from 'ahooks';

const Input = (
  props: InputProps & {
    triggerOnChangeInOnChange?: boolean;
  },
) => {
  const {
    value,
    defaultValue,
    onChange: propsOnChange,
    onBlur: propsOnBlur,
    triggerOnChangeInOnChange = false,
    onFocus: propsOnFocus,
  } = props;

  const [stateValue, setStateValue] = useState<any>(value ?? defaultValue);
  const focus = useRef<boolean>(!!props.autoFocus);

  const onChange = useCallback(
    (e) => {
      const value = e.target.value;
      setStateValue(value);
      triggerOnChangeInOnChange && propsOnChange?.(value);
    },
    [propsOnChange, triggerOnChangeInOnChange],
  );

  const onBlur = useCallback(
    (e) => {
      if (value !== stateValue) propsOnChange?.(stateValue);
      propsOnBlur?.(e);
      focus.current = false;
    },
    [propsOnBlur, propsOnChange, stateValue, value],
  );

  const onFocus = useCallback(
    (e) => {
      propsOnFocus?.(e);
      focus.current = true;
    },
    [propsOnFocus],
  );

  useEffect(() => {
    if (value !== undefined) {
      setStateValue(value);
    }
  }, [value]);

  useUnmount(() => {
    if (value != stateValue && focus.current) propsOnChange?.(stateValue);
  });

  return (
    <AntInput
      {...props}
      onFocus={onFocus}
      onChange={onChange}
      onBlur={onBlur}
      value={stateValue}
    />
  );
};

export default Input;
