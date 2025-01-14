import { useEffect, useRef } from 'react';
import { init } from 'echarts';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import * as echarts from 'echarts';
import { useDeepUpdateEffect } from '@/hooks';
import {
  useComponent,
  useChartComponentResize,
  useChartValueMapField,
  useComponentResize,
  useCondition,
  useChartComponentTooltip,
} from '@/components/ChartComponents/Common/Component/hook';
import { radialGradientColor } from '@/components/ChartComponents/Common/utils';
import ColorSelect from '@/components/ColorSelect';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import chinaMap from './china.json';
import { TScatterMapConfig } from '../type';

echarts.registerMap('china', chinaMap as any);

const { getRgbaString } = ColorSelect;

const CHART_ID = 'SCATTER_MAP';

const ScatterMap = (
  props: ComponentData.CommonComponentProps<TScatterMapConfig>,
) => {
  const { className, style, value, global, children, wrapper: Wrapper } = props;
  const { screenTheme, screenType } = global;

  const {
    id,
    config: {
      options,
      style: { border },
    },
  } = value;

  const { tooltip, condition, geo, scatter } = options;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const chartInstance = useRef<echarts.ECharts>();
  const requestRef = useRef<TFetchFragmentRef>(null);

  useComponentResize(value, () => {
    chartInstance?.current?.resize();
  });

  const {
    request,
    syncInteractiveAction,
    linkageMethod,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
    onCondition,
  } = useComponent<TScatterMapConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const {
    onCondition: propsOnCondition,
    style: conditionStyle,
    className: conditionClassName,
  } = useCondition(onCondition, screenType);

  const { realValue } = useChartValueMapField(processedValue, {
    map: componentFilterMap,
    fields: {
      seriesKey: 's',
      xAxisKeyKey: 'name',
      yAxisValue: 'value',
    },
    formatMethod: (value) => {
      return {
        realValue: value.map((item: any) => {
          const { name, center, value } = item;
          return {
            name,
            value: [...(center || []), value],
          };
        }),
      };
    },
  });

  const onClick = (params: any) => {
    const { data } = params;
    const { name, value } = data;
    const target = {
      name: name,
      value: value[2],
      center: value.slice(0, 2),
    };
    syncInteractiveAction('click', target);
    linkageMethod('click-item', target);
  };

  const initChart = () => {
    const chart = init(
      document.querySelector(`#${chartId.current!}`)!,
      screenTheme,
      {
        renderer: 'canvas',
      },
    );
    chartInstance.current = chart;
    setOption();
  };

  const setOption = () => {
    const { itemStyle, ...nextGeo } = geo;
    const {
      rippleEffect,
      label: scatterLabel,
      itemStyle: scatterItemStyle,
      symbolSize,
      ...nextScatter
    } = scatter;

    const {
      backgroundColor,
      textStyle: tooltipTextStyle,
      animation,
      ...nextTooltip
    } = tooltip;

    const series = [
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        aspectScale: 0.75, //长宽比
        showLegendSymbol: false, // 存在legend时显示
        roam: true,
        animation: false,
        label: {
          show: false,
        },
        silent: true,
      },
      {
        ...nextScatter,
        symbolSize: (value: any) => {
          return value[2] * symbolSize;
        },
        geoIndex: 0,
        rippleEffect: {
          ...rippleEffect,
          color: getRgbaString(rippleEffect.color),
        },
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: realValue,
        label: {
          ...scatterLabel,
          color: getRgbaString(scatterLabel.color),
        },
        itemStyle: {
          ...scatterItemStyle,
          color: getRgbaString(scatterItemStyle.color),
        },
        zlevel: 1,
        tooltip: {
          ...nextTooltip,
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
          backgroundColor: getRgbaString(backgroundColor),
          textStyle: {
            ...tooltipTextStyle,
            color: getRgbaString(tooltipTextStyle.color),
          },
        },
      },
    ];

    chartInstance.current?.setOption({
      geo: {
        ...nextGeo,
        show: true,
        map: 'china',
        roam: true,
        zoom: 1,
        label: {
          show: false,
        },
        itemStyle: {
          ...itemStyle.normal,
          borderColor: getRgbaString(itemStyle.normal.borderColor),
          areaColor: radialGradientColor(itemStyle.normal.areaColor),
          shadowColor: getRgbaString(itemStyle.normal.shadowColor),
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            ...itemStyle.emphasis,
            borderColor: getRgbaString(itemStyle.emphasis.borderColor),
            areaColor: radialGradientColor(itemStyle.emphasis.areaColor),
            shadowColor: getRgbaString(itemStyle.emphasis.shadowColor),
          },
        },
        silent: true,
      },
      series,
      tooltip: {
        show: false,
      },
    });

    screenType !== 'edit' &&
      animation.show &&
      useChartComponentTooltip(chartInstance.current!, series, {
        interval: animation.speed,
        loopSeries: false,
        seriesIndex: 1,
      });
  };

  useChartComponentResize(chartInstance.current!);

  useEffect(() => {
    initChart();
    return () => {
      chartInstance.current?.dispose();
    };
  }, [screenTheme]);

  useEffect(() => {
    chartInstance.current?.off('click');
    chartInstance.current?.on('click', onClick);
  }, [syncInteractiveAction]);

  // 数据发生变化时
  useDeepUpdateEffect(() => {
    setOption();
  }, [processedValue, options, realValue]);

  // 配置发生变化时
  useDeepUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [processedValue, options, realValue]);

  return (
    <>
      <div
        className={classnames(className, conditionClassName)}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
          conditionStyle,
        )}
      >
        <Wrapper border={border}>
          <div id={chartId.current} className="w-100 h-100"></div>
          {children}
        </Wrapper>
      </div>
      <FetchFragment
        id={id}
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        reCondition={propsOnCondition}
        componentFilter={componentFilter}
        componentCondition={condition}
      />
    </>
  );
};

const WrapperScatterMap: typeof ScatterMap & {
  id: ComponentData.TComponentSelfType;
} = ScatterMap as any;

WrapperScatterMap.id = CHART_ID;

export default WrapperScatterMap;
