import { useCallback, useState } from 'react';
import { Button, Input } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './index.less';

const NameEditor = (props: {
  value: string;
  onChange?: (value: string) => void;
  isHover: boolean;
}) => {
  const { value, isHover, onChange } = props;
  const [inputValue, setInputValue] = useState<string>(value);
  const [editable, setEditable] = useState<boolean>(false);

  const onInputChange = useCallback((e: any) => {
    const value = e.target.value;
    setInputValue(value);
  }, []);

  const onConfirm = useCallback(() => {
    onChange?.(inputValue || value);
    setEditable(false);
  }, [onChange]);

  const stop = (e: any) => {
    e.stopPropagation();
  };

  const wrapperClick = useCallback(
    (e: any) => {
      stop(e);
    },
    [editable],
  );

  return (
    <div
      className={styles['design-config-data-filter-list-item-header-name']}
      onClick={wrapperClick}
    >
      {editable ? (
        <Input
          value={inputValue}
          onChange={onInputChange}
          onBlur={onConfirm}
          onClick={stop}
        />
      ) : (
        <>
          <div className="text-ellipsis" title={inputValue}>
            {inputValue}
          </div>
          {isHover && (
            <Button
              className="h-a"
              type="link"
              icon={<EditFilled />}
              onClick={(e) => {
                stop(e);
                setEditable(true);
              }}
            ></Button>
          )}
        </>
      )}
    </div>
  );
};

export default NameEditor;