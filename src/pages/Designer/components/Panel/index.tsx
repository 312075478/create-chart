import ReactSelecto from './components/ReactSelecto';
import PanelWrapper from './components/PanelWrapper';
import ToolBar from './components/ToolBar';
import Painter from './components/Painter';

const Panel = () => {
  return (
    <div className="dis-flex-column">
      <PanelWrapper>
        <ReactSelecto />
        <Painter />
      </PanelWrapper>
      <ToolBar />
    </div>
  );
};

export default Panel;
