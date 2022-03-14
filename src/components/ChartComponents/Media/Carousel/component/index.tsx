import { CSSProperties, useMemo, useRef, useCallback } from 'react';
import { Carousel } from 'antd';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import { useComponent } from '@/components/ChartComponents/Common/Component/hook';
import { ComponentProps } from '@/components/ChartComponents/Common/Component/type';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import FilterDataUtil from '@/utils/Assist/FilterData';
import { TCarouselConfig } from '../type';
import styles from './index.less';

const CHART_ID = 'CAROUSEL';

const CarouselBasic = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TCarouselConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;

  const {
    config: {
      options,
      style: { height },
    },
  } = value;
  const { dot, speed, autoplay, fade } = options;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const requestRef = useRef<TFetchFragmentRef>(null);

  const {
    request,
    syncInteractiveAction,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
  } = useComponent<TCarouselConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const finalValue = useMemo(() => {
    return FilterDataUtil.getFieldMapValue(processedValue, {
      map: componentFilterMap,
    });
  }, [processedValue, componentFilterMap]);

  const onClick = useCallback(
    (value) => {
      syncInteractiveAction('click', value);
    },
    [syncInteractiveAction],
  );

  const componentClassName = useMemo(() => {
    return classnames(className, styles['component-media-carousel']);
  }, [className]);

  const imageList = useMemo(() => {
    console.log(height, 2222);
    return finalValue.map((item: any) => {
      const { value, name } = item;
      return (
        <div>
          <img
            key={name}
            src={value}
            onClick={onClick.bind(null, item)}
            style={{
              height: height - 4,
              width: '100%',
            }}
          />
        </div>
      );
    });
  }, [finalValue, onClick, height]);

  return (
    <>
      <div
        className={componentClassName}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
        )}
        id={chartId.current}
      >
        <Carousel
          autoplay={autoplay}
          dots={dot.show}
          dotPosition={dot.position}
          speed={speed}
          fade={fade}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {imageList}
        </Carousel>
      </div>
      <FetchFragment
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        componentFilter={componentFilter}
      />
    </>
  );
};

const WrapperCarousel: typeof CarouselBasic & {
  id: ComponentData.TComponentSelfType;
} = CarouselBasic as any;

WrapperCarousel.id = CHART_ID;

export default WrapperCarousel;