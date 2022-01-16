import classnames from 'classnames';
import {
  UndoIcon,
  RedoIcon,
  LayerCollapseIcon,
  LayerShowIcon,
  GuideLineIcon,
  CallbackIcon,
} from './action.map';
import styles from './index.less';

const ToolBar = () => {
  return (
    <div
      className={classnames(
        styles['page-design-left-tool-bar'],
        'border-r-8',
        'ali-cen',
        'dis-flex-column',
        'border-1',
        'normal-background',
      )}
    >
      <UndoIcon />
      <RedoIcon />
      <LayerCollapseIcon />
      <LayerShowIcon />
      <GuideLineIcon />
      <CallbackIcon />
    </div>
  );
};

export default ToolBar;
