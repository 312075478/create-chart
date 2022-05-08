import {
  CSSProperties,
  useMemo,
  useRef,
  useState,
  useEffect,
  Children,
  cloneElement,
} from 'react';
import { uniqueId, merge } from 'lodash';
import { DatePicker as AntDatePicker } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import { useComponent } from '@/components/ChartComponents/Common/Component/hook';
import { ComponentProps } from '@/components/ChartComponents/Common/Component/type';
import ColorSelect from '@/components/ColorSelect';
import { TDatePickerConfig } from '../type';
import styles from './index.less';

const { getRgbaString } = ColorSelect;

const { WeekPicker, YearPicker, MonthPicker } = AntDatePicker;

const CHART_ID = 'DATE_PICKER';

const DatePicker = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TDatePickerConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;

  const {
    id,
    config: { options },
  } = value;
  const {
    defaultDate,
    mode,
    format,
    filterDate,
    filterTime,
    arrow,
    yearAndMonthAndTime,
    week,
    dateAndTime,
  } = options;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const [dateValue, setDateValue] = useState<moment.Moment>(
    moment(defaultDate),
  );

  const { syncInteractiveAction } = useComponent<TDatePickerConfig>(
    {
      component: value,
      global,
    },
    {
      current: {},
    } as any,
  );

  const onChange = (value: any) => {
    setDateValue(value);
    syncInteractiveAction('change', {
      value,
    });
  };

  const filterDateFunction = useMemo(() => {
    return new Function('data', filterDate);
  }, [filterDate]);

  const filterTimeFunction = useMemo(() => {
    return new Function('data', filterTime);
  }, [filterTime]);

  const DatePickerDom = useMemo(() => {
    const prefix = 'component-interactive-date-picker';
    const className = `${prefix}-${mode}`;
    console.log(filterDateFunction());
    const commonProps: any = {
      className: classnames('w-100'),
      value: dateValue,
      format,
      onChange,
      // open: true,
      disabledDate: filterDateFunction,
      disabledTime: filterTimeFunction,
      dropdownClassName: classnames(styles[className]),
      panelRender: (node: any) => {
        return cloneElement(node, {
          style: {
            [`--${prefix}-arrow-color`]: getRgbaString(arrow.color),
            [`--${prefix}-arrow-color-active`]: getRgbaString(
              arrow.active.color,
            ),

            [`--${prefix}-header-font-size`]:
              yearAndMonthAndTime.textStyle.fontSize + 'px',
            [`--${prefix}-header-font-weight`]:
              yearAndMonthAndTime.textStyle.fontWeight,
            [`--${prefix}-header-font-family`]:
              yearAndMonthAndTime.textStyle.fontFamily,
            [`--${prefix}-header-color`]: getRgbaString(
              yearAndMonthAndTime.textStyle.color,
            ),

            [`--${prefix}-week-font-size`]: week.textStyle.fontSize + 'px',
            [`--${prefix}-week-font-weight`]: week.textStyle.fontWeight,
            [`--${prefix}-week-font-family`]: week.textStyle.fontFamily,
            [`--${prefix}-week-color`]: getRgbaString(week.textStyle.color),

            [`--${prefix}-date-border-radius`]: dateAndTime.borderRadius + 'px',

            [`--${prefix}-date-font-size`]:
              dateAndTime.textStyle.fontSize + 'px',
            [`--${prefix}-date-font-weight`]: dateAndTime.textStyle.fontWeight,
            [`--${prefix}-date-font-family`]: dateAndTime.textStyle.fontFamily,
            [`--${prefix}-date-color`]: getRgbaString(
              dateAndTime.textStyle.color,
            ),
            [`--${prefix}-date-background-color`]: getRgbaString(
              dateAndTime.backgroundColor,
            ),

            [`--${prefix}-date-hover-font-size`]:
              dateAndTime.hover.textStyle.fontSize + 'px',
            [`--${prefix}-date-hover-font-weight`]:
              dateAndTime.hover.textStyle.fontWeight,
            [`--${prefix}-date-hover-font-family`]:
              dateAndTime.hover.textStyle.fontFamily,
            [`--${prefix}-date-hover-color`]: getRgbaString(
              dateAndTime.hover.textStyle.color,
            ),
            [`--${prefix}-date-hover-background-color`]: getRgbaString(
              dateAndTime.hover.backgroundColor,
            ),

            [`--${prefix}-date-active-font-size`]:
              dateAndTime.active.textStyle.fontSize + 'px',
            [`--${prefix}-date-active-font-weight`]:
              dateAndTime.active.textStyle.fontWeight,
            [`--${prefix}-date-active-font-family`]:
              dateAndTime.active.textStyle.fontFamily,
            [`--${prefix}-date-active-color`]: getRgbaString(
              dateAndTime.active.textStyle.color,
            ),
            [`--${prefix}-date-active-background-color`]: getRgbaString(
              dateAndTime.active.backgroundColor,
            ),

            [`--${prefix}-date-disabled-font-size`]:
              dateAndTime.disabled.textStyle.fontSize + 'px',
            [`--${prefix}-date-disabled-font-weight`]:
              dateAndTime.disabled.textStyle.fontWeight,
            [`--${prefix}-date-disabled-font-family`]:
              dateAndTime.disabled.textStyle.fontFamily,
            [`--${prefix}-date-disabled-color`]: getRgbaString(
              dateAndTime.disabled.textStyle.color,
            ),
            [`--${prefix}-date-disabled-background-color`]: getRgbaString(
              dateAndTime.disabled.backgroundColor,
            ),

            [`--${prefix}-date-next-prev-font-size`]:
              dateAndTime.prevAndNext.textStyle.fontSize + 'px',
            [`--${prefix}-date-next-prev-font-weight`]:
              dateAndTime.prevAndNext.textStyle.fontWeight,
            [`--${prefix}-date-next-prev-font-family`]:
              dateAndTime.prevAndNext.textStyle.fontFamily,
            [`--${prefix}-date-next-prev-color`]: getRgbaString(
              dateAndTime.prevAndNext.textStyle.color,
            ),
            [`--${prefix}-date-next-prev-background-color`]: getRgbaString(
              dateAndTime.prevAndNext.backgroundColor,
            ),
          },
        });
      },
    };
    switch (mode) {
      case 'date':
        return <AntDatePicker {...commonProps} />;
      case 'month':
        return <MonthPicker {...commonProps} />;
      case 'time':
        return <AntDatePicker showTime {...commonProps} />;
      case 'week':
        return <WeekPicker {...commonProps} />;
      case 'year':
        return <YearPicker {...commonProps} />;
    }
  }, [
    mode,
    dateValue,
    format,
    arrow,
    yearAndMonthAndTime,
    week,
    dateAndTime,
    filterTimeFunction,
    filterDateFunction,
  ]);

  const componentClassName = useMemo(() => {
    return classnames(
      'dis-flex',
      className,
      styles['component-interactive-date-picker'],
    );
  }, [className]);

  useEffect(() => {
    setDateValue(moment(defaultDate));
  }, [defaultDate]);

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
        {DatePickerDom}
      </div>
    </>
  );
};

const WrapperDatePicker: typeof DatePicker & {
  id: ComponentData.TComponentSelfType;
} = DatePicker as any;

WrapperDatePicker.id = CHART_ID;

export default WrapperDatePicker;
