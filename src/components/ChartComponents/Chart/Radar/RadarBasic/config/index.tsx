import { Component } from 'react';
import ComponentOptionConfig, {
  Tab,
} from '@/components/ChartComponents/Common/ComponentOptionConfig';
import ConfigList from '@/components/ChartComponents/Common/Structure/ConfigList';
import LegendConfig from './Legend';
import TooltipConfig from './Tooltip';
import SeriesConfig from './Series';
import AnimationConfig from './Animation';
import RadarConfig from './Radar';
import ConditionConfig from './Condition';
import { TRadarBasicConfig } from '../type';
class Config extends Component<
  ComponentData.ComponentConfigProps<TRadarBasicConfig>
> {
  render() {
    const { value, onChange } = this.props;
    const {
      config: {
        options: { legend, series, tooltip, animation, radar, condition },
      },
    } = value;

    return (
      <ComponentOptionConfig
        items={[
          {
            label: <Tab>雷达图</Tab>,
            children: (
              <ConfigList level={1}>
                <RadarConfig value={radar} onChange={onChange} />
              </ConfigList>
            ),
            key: '1',
          },
          {
            label: <Tab>图例</Tab>,
            children: (
              <ConfigList level={1}>
                <LegendConfig value={legend} onChange={onChange} />
              </ConfigList>
            ),
            key: '2',
          },
          {
            label: <Tab>提示文字</Tab>,
            children: (
              <ConfigList level={1}>
                <TooltipConfig value={tooltip} onChange={onChange} />
              </ConfigList>
            ),
            key: '3',
          },
          {
            label: <Tab>系列</Tab>,
            children: (
              <ConfigList level={1}>
                <SeriesConfig value={series} onChange={onChange} />
              </ConfigList>
            ),
            key: '4',
          },
          {
            label: <Tab>动画</Tab>,
            children: (
              <ConfigList level={1}>
                <AnimationConfig value={animation} onChange={onChange} />
              </ConfigList>
            ),
            key: '5',
          },
          {
            label: <Tab>条件</Tab>,
            children: (
              <ConfigList level={1}>
                <ConditionConfig value={condition} onChange={onChange} />
              </ConfigList>
            ),
            key: '6',
          },
        ]}
      />
    );
  }
}

export default Config;
