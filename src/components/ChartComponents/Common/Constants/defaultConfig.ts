import { omit } from 'lodash';
import { nanoid } from 'nanoid';
import ThemeUtil from '@/utils/Assist/Theme';
import { DEFAULT_BORDER } from '@/components/InternalBorder';

// 默认linkage
export const DEFAULT_LINKAGE_CONFIG = {
  show: false,
  description: '',
  value: '',
};

// 默认的透明度
export const DEFAULT_OPACITY = 0.4;

export const DEFAULT_RADIAL_CONFIG: Pick<
  ComponentData.TGradientColorConfig,
  'type' | 'linearPosition' | 'radialPosition'
> = {
  type: 'linear',
  linearPosition: {
    startX: 0,
    startY: 0,
    endX: 1,
    endY: 1,
  },
  radialPosition: {
    x: 0.5,
    y: 0.5,
    r: 5,
  },
};

export const DEFAULT_THEME_COLOR_LIST: () => ComponentData.TColorConfig[] =
  () =>
    new Array(ThemeUtil.currentThemeColorLength).fill(0).map((_, index) => {
      return ThemeUtil.generateNextColor4CurrentTheme(index);
    });

export const DEFAULT_THEME_RADIAL_COLOR_LIST: () => ComponentData.TGradientColorConfig[] =
  () =>
    new Array(ThemeUtil.currentThemeColorLength).fill(0).map((_, index) => {
      return {
        ...DEFAULT_RADIAL_CONFIG,
        linearPosition: {
          startX: 0.6,
          startY: 0,
          endX: 0.4,
          endY: 1,
        },
        start: ThemeUtil.generateNextColor4CurrentTheme(index),
        end: {
          ...ThemeUtil.generateNextColor4CurrentTheme(index),
          a: 0.2,
        },
      };
    });

export const BASIC_DEFAULT_CONFIG: ComponentData.TBaseConfig = {
  style: {
    width: 200,
    height: 200,
    left: 0,
    top: 0,
    opacity: 1,
    rotate: 0,
    zIndex: 2,
    skew: {
      x: 0,
      y: 0,
    },
    margin: {
      y: 0,
    },
    border: {
      show: false,
      value: DEFAULT_BORDER,
      disabled: false,
    },
  },
  attr: {
    visible: true,
    lock: false,
  },
};

export const BASIC_DEFAULT_DATA_CONFIG: ComponentData.TBaseConfig['data'] = {
  request: {
    url: '',
    method: 'GET',
    headers: '{}',
    body: '{}',
    frequency: {
      show: false,
      value: 5,
    },
    mock: {
      random: true,
      total: 20,
      fields: [],
    },
    serviceRequest: false,
    type: 'static',
    value: [],
    valueType: 'array',
  },
  filter: {
    show: false,
    value: [],
    map: [],
  },
};

export const BASIC_DEFAULT_INTERACTIVE_CONFIG: ComponentData.TBaseConfig['interactive'] =
  {
    base: [],
    linkage: [],
  };

export const DEFAULT_FONT_CONFIG: ComponentData.TFontConfig = {
  color: {
    r: 255,
    g: 255,
    b: 255,
  },
  fontSize: 12,
  fontWeight: 'normal',
  fontFamily: 'sans-serif',
};

// legend
export const DEFAULT_LEGEND_CONFIG: ComponentData.ComponentLegend = {
  type: 'plain',
  show: true,
  orient: 'horizontal',
  itemGap: 10,
  textStyle: DEFAULT_FONT_CONFIG,
  left: 'center',
  top: 'bottom',
  align: 'auto',
  itemStyle: {
    itemWidth: 14,
    itemHeight: 14,
    icon: 'rect',
    sizeIgnore: true,
  },
};

// grid
export const DEFAULT_GRID_CONFIG: ComponentData.ComponentGrid = {
  left: 60,
  top: 40,
  right: 40,
  bottom: 60,
  show: true,
};

// xAxis
export const DEFAULT_X_AXIS_CONFIG: ComponentData.ComponentXAxis = {
  show: true,
  position: 'bottom',
  axisLabel: {
    rotate: 0,
    margin: 8,
    ...DEFAULT_FONT_CONFIG,
  },
  name: '',
};

// yAxis
export const DEFAULT_Y_AXIS_CONFIG: ComponentData.ComponentYAxis = {
  ...omit(DEFAULT_X_AXIS_CONFIG, 'position'),
  position: 'left',
};

// tooltip
export const DEFAULT_TOOLTIP_CONFIG: () => ComponentData.ComponentTooltip =
  () => {
    return {
      show: true,
      formatter: '',
      backgroundColor: {
        ...ThemeUtil.generateNextColor4CurrentTheme(0),
        a: 0.6,
      },
      textStyle: {
        ...DEFAULT_FONT_CONFIG,
        color: {
          r: 255,
          g: 255,
          b: 255,
        },
        fontSize: 14,
      },
    };
  };

// tooltip animation
export const DEFAULT_TOOLTIP_ANIMATION_CONFIG: ComponentData.ComponentTooltipAnimation =
  {
    show: false,
    speed: 5000,
  };

// animation
export const DEFAULT_ANIMATION_CONFIG: ComponentData.ComponentChartAnimationConfig =
  {
    animation: true,
    animationDuration: 1000,
    animationEasing: 'cubicOut',
  };

// label
export const DEFAULT_LABEL_CONFIG: ComponentData.ComponentSeriesLabelConfig = {
  position: 'inside',
  ...DEFAULT_FONT_CONFIG,
  show: true,
};

// condition rule item value
export const DEFAULT_CONDITION_CONFIG_ITEM_RULE_VALUE: () => ComponentData.ComponentRuleConditionItemRule =
  () => ({
    id: nanoid(),
    params: '',
    condition: 'equal',
    value: '',
  });

// condition rule item
export const DEFAULT_CONDITION_CONFIG_ITEM_RULE: () => ComponentData.ComponentRuleConditionItem =
  () => ({
    id: nanoid(),
    type: 'and',
    rule: [
      {
        ...DEFAULT_CONDITION_CONFIG_ITEM_RULE_VALUE(),
      },
    ],
  });

// condition
export const DEFAULT_CONDITION_CONFIG: () => ComponentData.ComponentConditionConfig =
  () => ({
    value: [
      {
        id: nanoid(),
        action: 'hidden',
        type: 'condition',
        value: {
          code: {
            relation: [],
            code: `
            // 可从参数中获取相关数据
            // 在这里添加逻辑
            // 返回true | false 表示是否符合条件
            return true 
          `,
          },
          condition: {
            id: nanoid(),
            type: 'and',
            rule: [
              {
                ...DEFAULT_CONDITION_CONFIG_ITEM_RULE(),
              },
            ],
          },
        },
      },
    ],
    initialState: 'visible',
  });
