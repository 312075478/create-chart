import { omit } from 'lodash';
import { mergeWithoutArray } from '@/utils';
import ThemeUtil from '@/utils/Assist/Theme';
import {
  BASIC_DEFAULT_CONFIG,
  BASIC_DEFAULT_DATA_CONFIG,
  BASIC_DEFAULT_INTERACTIVE_CONFIG,
  DEFAULT_LEGEND_CONFIG,
  DEFAULT_TOOLTIP_CONFIG,
  DEFAULT_FONT_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_CONDITION_CONFIG,
  DEFAULT_TOOLTIP_ANIMATION_CONFIG,
  DEFAULT_LINKAGE_CONFIG,
} from '../../../Common/Constants/defaultConfig';
import { getName, getNumberValue } from '@/utils/constants';
import { TCirclePieConfig } from './type';

const DEFAULT_NAME_LABEL = getName(5);
const DEFAULT_DATE_VALUE = getNumberValue(5);

const DEFAULT_VALUE = DEFAULT_NAME_LABEL.map((item, index) => {
  return {
    name: item,
    value: DEFAULT_DATE_VALUE[index],
  };
});

export default () => {
  const CUSTOM_CONFIG: ComponentData.TInternalComponentConfig<TCirclePieConfig> =
    {
      interactive: {
        base: [
          {
            type: 'click',
            name: '当点击项时',
            show: false,
            fields: [
              {
                key: 'name',
                variable: '',
                description: '数据项',
              },
              {
                key: 'value',
                variable: '',
                description: '数据值',
              },
            ],
          },
        ],
        linkage: [
          {
            ...DEFAULT_LINKAGE_CONFIG,
            type: 'click-item',
            name: '点击项',
          },
        ],
      },
      data: {
        request: {
          value: DEFAULT_VALUE,
        },
        filter: {
          map: [
            {
              field: 'name',
              map: '',
              description: '数据项',
              id: 'name',
              type: 'string',
            },
            {
              field: 'value',
              map: '',
              description: '数据值',
              id: 'value',
              type: 'number',
            },
          ],
        },
      },
      options: {
        condition: DEFAULT_CONDITION_CONFIG(),
        legend: omit(DEFAULT_LEGEND_CONFIG, 'type'),
        tooltip: {
          ...DEFAULT_TOOLTIP_CONFIG(),
          animation: DEFAULT_TOOLTIP_ANIMATION_CONFIG,
        },
        animation: {
          ...DEFAULT_ANIMATION_CONFIG,
          animationDuration: 2000,
          animationEasing: 'quadraticInOut',
        },
        statistics: {
          show: true,
          align: 'horizontal',
          textStyle: {
            ...DEFAULT_FONT_CONFIG,
            fontSize: 24,
          },
          addonBefore: {
            show: true,
            value: '共',
            textStyle: {
              ...DEFAULT_FONT_CONFIG,
              fontSize: 24,
            },
          },
          addonAfter: {
            show: true,
            value: '人',
            textStyle: {
              ...DEFAULT_FONT_CONFIG,
              fontSize: 24,
            },
          },
        },
        series: {
          label: {
            show: true,
            formatter: '{b}: {c}',
            ...DEFAULT_FONT_CONFIG,
            color: {
              r: 255,
              g: 255,
              b: 255,
            },
          },
          radius: [50, 60],
          itemStyle: {
            color: [],
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 15,
            smooth: false,
          },
        },
      },
    };

  const DefaultConfig: ComponentData.TComponentData<TCirclePieConfig> =
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

export const themeConfig = {
  convert: (colorList: string[], options: TCirclePieConfig) => {
    return {
      tooltip: {
        backgroundColor: DEFAULT_TOOLTIP_CONFIG().backgroundColor,
      },
      series: {
        itemStyle: {
          color: options.series.itemStyle.color.map((item, index) => {
            return ThemeUtil.generateNextColor4CurrentTheme(index);
          }),
        },
      },
    };
  },
};
