import { useCallback } from 'react';
import EventEmitter from 'eventemitter3';

let HOVER_SELECT = '';
let CHANGE_DEALING = 0;

const EVENT_EMITTER = new EventEmitter();

export const useComponentHover: () => [
  string,
  (value: string) => void,
  (
    callback: (
      select: string,
      prevSelect: string,
      progress: { getter: () => boolean; setter: () => void },
    ) => void,
  ) => void,
] = () => {
  const setHoverSelect = useCallback((value: string) => {
    if (HOVER_SELECT === value) return;
    CHANGE_DEALING++;
    const prevSelect = HOVER_SELECT;
    HOVER_SELECT = value;
    setTimeout(() => {
      if (CHANGE_DEALING > 1) {
        CHANGE_DEALING--;
      } else {
        let hovered = false;
        EVENT_EMITTER.emit('change', value, prevSelect, {
          getter: () => {
            // 此步骤为了优化频繁调用hover的情况
            // ? 应该还可以再优化，就先这样吧
            return CHANGE_DEALING > 1; // || hovered;
          },
          setter: () => {
            hovered = true;
          },
        });
        CHANGE_DEALING = 0;
      }
    }, 100);
  }, []);

  const eventBinder = useCallback((callback) => {
    EVENT_EMITTER.addListener('change', callback);
    return () => {
      EVENT_EMITTER.removeListener('change', callback);
    };
  }, []);

  return [HOVER_SELECT, setHoverSelect, eventBinder];
};
