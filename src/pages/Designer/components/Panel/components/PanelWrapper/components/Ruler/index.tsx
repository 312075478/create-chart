import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { merge } from 'lodash';
import { connect } from 'dva';
import { useMouse, useHover } from 'ahooks';
import { nanoid } from 'nanoid';
import GuideLine from '@/components/GuideLine';
import ComponentRuler from '@/components/Ruler';
import { wrapperId, subWrapperId } from '../../constants';
import { mapStateToProps, mapDispatchToProps } from './connect';
import { AbsorbUtil } from '../AbsorbGuideLine/utils';
import styles from './index.less';

let scroll = {
  x: 0,
  y: 0,
};

const getWrapperScroll = (cover = false) => {
  const element = document.querySelector('#designer-page-main');
  scroll.x = element?.scrollLeft || 0;
  scroll.y = element?.scrollTop || 0;
};

const Ruler = (props: {
  guideLineShow: boolean;
  scale: number;
  size: { width: number; height: number };
  guideLineList: ComponentData.TGuideLineConfigItem[];
  wrapperSetGuideLine: (value: Partial<ComponentData.TGuideLineConfig>) => void;
}) => {
  const { guideLineShow, size, guideLineList, wrapperSetGuideLine, scale } =
    props;

  const [mouseHorizontalGuideLine, setMouseHorizontalGuideLine] =
    useState<ComponentData.TGuideLineConfigItem>();
  const [mouseVerticalGuideLine, setMouseVerticalGuideLine] =
    useState<ComponentData.TGuideLineConfigItem>();

  const mousePosition = useMouse();

  const horizontalRulerRef = useRef<any>();
  const verticalRulerRef = useRef<any>();
  const disabledMouseGuideLine = useRef<boolean>(false);

  const isHorizontalRulerHover = useHover(horizontalRulerRef);

  const isVerticalRulerHover = useHover(verticalRulerRef);

  const onGuidelinePositionChange = useCallback(
    (index, item) => {
      let newGuideList = [...guideLineList];
      newGuideList.splice(index, 1, item);
      wrapperSetGuideLine({
        value: newGuideList as ComponentData.TGuideLineConfigItem[],
      });
    },
    [wrapperSetGuideLine, guideLineList],
  );

  const getWrapperScrollStyle = useCallback(() => {
    const dom = document.querySelector(`#${wrapperId}`);
    return {
      left: dom?.scrollLeft || 0,
      top: dom?.scrollTop || 0,
    };
  }, []);

  const getSubWrapperStyle = useCallback(() => {
    let wrapper = document.querySelector(`#${subWrapperId}`);
    if (!wrapper)
      return {
        left: 0,
        top: 0,
      };
    const { x, y } = wrapper.getBoundingClientRect();
    return {
      left: x || 0,
      top: y || 0,
    };
  }, []);

  const generateGuideLine = useCallback(
    (
      direction,
      style,
      insertToList,
      e,
      lineStyle: 'solid' | 'dashed' = 'solid',
    ) => {
      if (!guideLineShow) return;
      const { clientX, clientY } = e;
      let positionStyle: Partial<ComponentData.TGuideLineConfigItem['style']> =
        {};

      const { left, top } = getSubWrapperStyle();
      const { left: scrollLeft, top: scrollTop } = getWrapperScrollStyle();
      const { x, y } = scroll;
      if (direction === 'vertical') {
        positionStyle.left = clientX - left + scrollLeft - x;
      } else {
        positionStyle.top = clientY - top + scrollTop - y;
      }
      const newItem: ComponentData.TGuideLineConfigItem = {
        type: direction,
        style: merge({}, style, positionStyle),
        id: nanoid(),
        lineStyle,
      };

      insertToList &&
        wrapperSetGuideLine({
          value: [
            ...guideLineList,
            newItem,
          ] as ComponentData.TGuideLineConfigItem[],
        });

      return newItem;
    },
    [
      guideLineShow,
      guideLineList,
      wrapperSetGuideLine,
      getSubWrapperStyle,
      getWrapperScroll,
    ],
  );

  const setMousePosition = () => {
    const { clientX, clientY } = mousePosition;
    if (disabledMouseGuideLine.current) return;
    if (isHorizontalRulerHover) {
      getWrapperScroll();
      const result = generateGuideLine(
        'vertical',
        {
          width: 2,
          height: size.height,
        },
        false,
        {
          clientX: clientX,
          clientY: clientY,
        },
        'dashed',
      );
      setMouseHorizontalGuideLine(result);
    } else if (isVerticalRulerHover) {
      getWrapperScroll();
      const result = generateGuideLine(
        'horizontal',
        {
          width: size.width,
          height: 2,
        },
        false,
        {
          clientX: clientX,
          clientY: clientY,
        },
        'dashed',
      );
      setMouseVerticalGuideLine(result);
    }
  };

  const deleteGuideLine = useCallback(
    (index: number) => {
      const newGuideList = [...guideLineList];
      newGuideList.splice(index, 1);
      wrapperSetGuideLine({
        value: newGuideList,
      });
    },
    [guideLineList, wrapperSetGuideLine],
  );

  const onMoveEnd = useCallback(
    (item: ComponentData.TGuideLineConfigItem, index: number) => {
      // close the disabled
      disabledMouseGuideLine.current = false;

      const {
        type,
        style: { left, top },
      } = item;
      let change = false;
      const newGuideList = [...guideLineList];

      if (type === 'horizontal') {
        if (top <= 30 || top >= size.height) {
          newGuideList.splice(index, 1);
          change = true;
        }
      } else {
        if (left <= 30 || left >= size.width) {
          newGuideList.splice(index, 1);
          change = true;
        }
      }
      if (change) {
        wrapperSetGuideLine({
          value: newGuideList,
        });
        AbsorbUtil.onGuideLineMoveEnd(item, index);
      }
    },
    [guideLineList, size, wrapperSetGuideLine],
  );

  const onMoveStart = useCallback(() => {
    disabledMouseGuideLine.current = true;
  }, []);

  const onMouseMove = useCallback(
    (value: ComponentData.TGuideLineConfigItem, index: number) => {
      AbsorbUtil.onGuideLineMove(value, index);
    },
    [],
  );

  const renderGuideLineItem = useCallback(
    (
      item: ComponentData.TGuideLineConfigItem,
      index: number,
      account: ComponentData.TGuideLineConfigItem[],
    ) => {
      return (
        <GuideLine
          {...item}
          onChange={onGuidelinePositionChange.bind(this, index)}
          onMouseUp={onMoveEnd.bind(this, item, index)}
          onMouseDown={onMoveStart}
          onDoubleClick={deleteGuideLine.bind(this, index)}
          onMouseMove={onMouseMove.bind(null, item, index)}
          key={item.id}
        />
      );
    },
    [onMoveEnd, onGuidelinePositionChange],
  );

  const guideLineListDoms = useMemo(() => {
    if (!guideLineShow) return;
    return guideLineList.map(renderGuideLineItem);
  }, [guideLineShow, guideLineList, renderGuideLineItem]);

  const mouseGuideLineList = useMemo(() => {
    if (!guideLineShow) return;
    let list: ComponentData.TGuideLineConfigItem[] = [];
    if (isHorizontalRulerHover && mouseHorizontalGuideLine)
      list.push(mouseHorizontalGuideLine);
    if (isVerticalRulerHover && mouseVerticalGuideLine)
      list.push(mouseVerticalGuideLine);
    return list.map(renderGuideLineItem);
  }, [
    isHorizontalRulerHover,
    isVerticalRulerHover,
    guideLineShow,
    renderGuideLineItem,
    mouseHorizontalGuideLine,
    mouseVerticalGuideLine,
  ]);

  useEffect(() => {
    setMousePosition();
  }, [mousePosition]);

  useEffect(() => {
    getWrapperScroll(true);
  }, []);

  return (
    <>
      {/* Ruler */}
      <div
        ref={horizontalRulerRef}
        onClick={generateGuideLine.bind(
          this,
          'vertical',
          {
            width: 2,
            height: size.height,
          },
          true,
        )}
        className={classnames(
          styles['designer-page-main-horizontal-ruler'],
          'dis-flex',
        )}
        style={{ width: size.width }}
      >
        <div
          className={classnames(
            styles['designer-page-main-horizontal-ruler-prefix'],
            'dis-flex',
            'pos-ab',
          )}
        ></div>
        <ComponentRuler
          type="horizontal"
          width={size.width - 70}
          height={30}
          zoom={scale}
          unit={scale > 0.5 ? 50 : 100}
        />
      </div>
      <div
        ref={verticalRulerRef}
        style={{ height: size.height - 30 }}
        className={classnames(styles['designer-page-main-vertical-ruler'])}
        onClick={generateGuideLine.bind(
          this,
          'horizontal',
          {
            width: size.width,
            height: 2,
          },
          true,
        )}
      >
        <ComponentRuler
          width={30}
          height={size.height - 70}
          zoom={scale}
          unit={scale > 0.5 ? 50 : 100}
        />
      </div>
      {/* Ruler */}
      {guideLineListDoms}
      {mouseGuideLineList}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Ruler);