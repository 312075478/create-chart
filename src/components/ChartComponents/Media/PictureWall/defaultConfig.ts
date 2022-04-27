import { mergeWithoutArray } from '@/utils';
import {
  BASIC_DEFAULT_CONFIG,
  BASIC_DEFAULT_DATA_CONFIG,
  BASIC_DEFAULT_INTERACTIVE_CONFIG,
} from '../../Common/Constants/defaultConfig';
import { TPictureWallConfig } from './type';

const DEFAULT_VALUE = new Array(9).fill(
  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
);

export default () => {
  const CUSTOM_CONFIG: ComponentData.TInternalComponentConfig<TPictureWallConfig> =
    {
      interactive: {
        base: [],
      },
      data: {
        request: {
          value: DEFAULT_VALUE,
        },
        filter: {
          map: [
            {
              field: 'value',
              map: '',
              description: '数据值',
              id: 'value',
              type: 'string[]',
            },
          ],
        },
      },
      options: {
        maxCount: 9,
        columnCount: 3,
        margin: [0, 0],
      },
    };

  const DefaultConfig: ComponentData.TComponentData<TPictureWallConfig> =
    mergeWithoutArray(
      {},
      {
        data: BASIC_DEFAULT_DATA_CONFIG,
        interactive: BASIC_DEFAULT_INTERACTIVE_CONFIG,
      },
      BASIC_DEFAULT_CONFIG,
      {
        style: {
          width: 400,
          height: 400,
        },
      },
      CUSTOM_CONFIG,
    );
  return DefaultConfig;
};
