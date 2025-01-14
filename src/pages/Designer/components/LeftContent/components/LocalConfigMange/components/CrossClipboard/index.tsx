import { useCallback } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import ConfigList from '@/components/ChartComponents/Common/Structure/ConfigList';
import FullForm from '@/components/ChartComponents/Common/Structure/FullForm';
import IconTooltip from '@/components/IconTooltip';
import { useLocalStorage } from '@/hooks';
import { LocalConfig } from '@/utils/Assist/LocalConfig';

const { Item } = ConfigList;

const CrossClipboard = () => {
  const [value, setValue] = useLocalStorage<
    Partial<ComponentClipboard.StorageClipboardType>
  >(LocalConfig.CONFIG_KEY_CROSS_CLIPBOARD, {
    show: true,
  });

  const onChange = useCallback(
    (key: keyof ComponentClipboard.StorageClipboardType, targetValue: any) => {
      setValue({
        ...value,
        [key]: targetValue,
      });
    },
    [setValue],
  );

  return (
    <Item
      label="跨屏复制"
      placeholder={
        <IconTooltip title="设计时允许跨屏进行复制屏内组件或组">
          <InfoCircleOutlined />
        </IconTooltip>
      }
    >
      <FullForm>
        <Switch checked={value?.show} onChange={onChange.bind(null, 'show')} />
      </FullForm>
    </Item>
  );
};

export default CrossClipboard;
