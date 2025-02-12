import { merge } from 'lodash';
import { PANEL_ABSOLUTE_POSITION, GUIDE_LINE_PADDING } from '@/utils/constants';
import { getDvaGlobalModelData } from '@/utils/Assist/Component';
import { AbsorbUtil } from '../../pages/Designer/components/Panel/components/PanelWrapper/components/AbsorbGuideLine/utils';

type NearlyData = {
  value: number;
  type:
    | 'left'
    | 'top'
    | 'right'
    | 'bottom'
    | 'horizontal' /*水平中间*/
    | 'vertical' /*垂直中间*/;
};

class AbsorbGuideLine {
  constructor(
    value: ComponentData.TGuideLineConfigItem,
    scale: () => number,
    onChange: (value: SuperPartial<ComponentData.TGuideLineConfigItem>) => void,
  ) {
    this.value = value;
    this.scale = scale;
    this.onChange = onChange;
  }

  onChange;
  delay = 0;
  value: ComponentData.TGuideLineConfigItem;
  scale: () => number;
  components: ComponentData.TComponentData[] = [];

  onMouseDown = () => {
    this.delay = 0;
    this.components = getDvaGlobalModelData().components;
  };

  onMouseMove = (style: ComponentData.TGuideLineConfigItem['style']) => {
    // 10-20 不可移动
    if (this.delay < 20) {
      this.delay++;
      if (this.delay > 10) {
        return;
      }
    }

    const { type } = this.value;
    const scale = this.scale();

    let nearlyComponent!: ComponentData.TComponentData;
    let nearlyData: NearlyData[] = [];

    const guideLineInfo = AbsorbUtil.getGuideLineInfo(
      merge({}, this.value, { style: { ...style } }),
      scale,
    );

    this.components.forEach((component) => {
      const range = AbsorbUtil.getEachRange(
        guideLineInfo,
        AbsorbUtil.getComponentInfo(component),
        type === 'horizontal'
          ? ['left', 'right', 'vertical']
          : ['top', 'bottom', 'horizontal'],
      );
      if (AbsorbUtil.rangeCompare(range, nearlyData)) {
        nearlyData = range;
        nearlyComponent = component;
      }
    });

    if (nearlyComponent) {
      const { left, top } = AbsorbUtil.getNeedToChangeStyle(
        nearlyData,
        AbsorbUtil.getComponentInfo(nearlyComponent),
        guideLineInfo,
      );
      let changeStyle: any = {};

      if (type === 'horizontal') {
        // changeStyle.top =
        //   ((top - guideLineInfo.height - GUIDE_LINE_PADDING) * scale +
        //     PANEL_ABSOLUTE_POSITION.top - 30) /
        //   scale;
        changeStyle.top =
          (top * scale -
            1 +
            1 -
            GUIDE_LINE_PADDING -
            30 +
            PANEL_ABSOLUTE_POSITION.top) /
            scale +
          2;
      } else {
        // changeStyle.left =
        //   ((left - guideLineInfo.width - GUIDE_LINE_PADDING) * scale +
        //     PANEL_ABSOLUTE_POSITION.left - 30) /
        //   scale;
        changeStyle.left =
          (left * scale -
            1 +
            1 -
            GUIDE_LINE_PADDING -
            30 +
            PANEL_ABSOLUTE_POSITION.left) /
            scale +
          2;
      }

      const newValue = merge({}, style, changeStyle);
      this.onChange(newValue);
      if (this.delay >= 20) {
        this.delay = 0;
      }
    }
  };

  onMouseUp = () => {
    this.components = [];
  };
}

export default AbsorbGuideLine;
