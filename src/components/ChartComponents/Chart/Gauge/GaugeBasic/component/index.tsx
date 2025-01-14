import { useEffect, useRef } from 'react';
import { init } from 'echarts';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import { useDeepUpdateEffect } from '@/hooks';
import {
  useComponent,
  useChartComponentResize,
  useChartValueMapField,
  useComponentResize,
  useAnimationChange,
  useCondition,
  useChartPerConfig,
} from '@/components/ChartComponents/Common/Component/hook';
import ColorSelect from '@/components/ColorSelect';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import { TGaugeBasicConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'GAUGE_BASIC';

const GaugeBasic = (
  props: ComponentData.CommonComponentProps<TGaugeBasicConfig>,
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

  const { series, animation, condition } =
    useChartPerConfig<TGaugeBasicConfig>(options);

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const chartInstance = useRef<echarts.ECharts>();
  const requestRef = useRef<TFetchFragmentRef>(null);

  useComponentResize(value, () => {
    chartInstance?.current?.resize();
  });

  const {
    request,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
    onCondition,
  } = useComponent<TGaugeBasicConfig>(
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

  const { xAxisKeys, yAxisValues } = useChartValueMapField(processedValue, {
    map: componentFilterMap,
    fields: {
      seriesKey: '',
      xAxisKeyKey: 'name',
      yAxisValue: 'value',
    },
  });

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

  const getSeries = () => {
    const {
      center,
      radius,
      progress,
      splitLine,
      axisTick,
      axisLabel,
      pointer,
      title,
      detail,
      axisLine,
      ...nextSeries
    } = series;
    const { animation: show, animationDuration, animationEasing } = animation;

    const baseSeries = {
      ...nextSeries,
      center: center.map((item) => `${item}%`),
      radius: radius + '%',
      type: 'gauge',
      axisLine: {
        ...axisLine,
        lineStyle: {
          ...axisLine.lineStyle,
          color: [[1, getRgbaString(axisLine.lineStyle.color)]],
        },
      },
      progress: {
        ...progress,
        itemStyle: {
          color: getRgbaString(progress.color),
        },
      },
      splitLine: {
        ...splitLine,
        lineStyle: {
          width: splitLine.width,
          color: getRgbaString(splitLine.color),
        },
      },
      axisLabel: {
        ...axisLabel,
        color: getRgbaString(axisLabel.color),
      },
      pointer: {
        ...pointer,
        itemStyle: {
          ...pointer.itemStyle,
          color: getRgbaString(pointer.itemStyle.color),
        },
      },
      title: {
        ...title,
        color: getRgbaString(title.color),
      },
      detail: {
        ...detail,
        color: getRgbaString(detail.color),
      },
      axisTick: {
        ...axisTick,
        lineStyle: {
          ...axisTick.lineStyle,
          color: getRgbaString(axisTick.lineStyle.color),
        },
      },
      data: xAxisKeys.map((item: any, index: number) => {
        return {
          name: item,
          value: yAxisValues._defaultValue_[index],
        };
      }),
      animation: show,
      animationEasing,
      animationEasingUpdate: animationEasing,
      animationDuration,
      animationDurationUpdate: animationDuration,
    };

    return baseSeries;
  };

  const setOption = () => {
    const series = getSeries();

    chartInstance.current?.setOption(
      {
        series,
      },
      true,
    );
  };

  useChartComponentResize(chartInstance.current!);

  useEffect(() => {
    initChart();
    return () => {
      chartInstance.current?.dispose();
    };
  }, [screenTheme]);

  // 数据发生变化时
  useDeepUpdateEffect(() => {
    setOption();
  }, [processedValue, xAxisKeys, yAxisValues]);

  // 配置发生变化时
  useDeepUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [options]);

  useAnimationChange(chartInstance.current!, animation, setOption);

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

const WrapperGaugeBasic: typeof GaugeBasic & {
  id: ComponentData.TComponentSelfType;
} = GaugeBasic as any;

WrapperGaugeBasic.id = CHART_ID;

export default WrapperGaugeBasic;
