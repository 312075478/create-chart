import {
  useState,
  forwardRef,
  useCallback,
  useMemo,
  useImperativeHandle,
} from 'react';
import { Button, Drawer, Table, Modal, Tooltip, Popconfirm, Empty } from 'antd';
import { connect } from 'dva';
import { nanoid } from 'nanoid';
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import CodeViewer from '@/components/CodeView';
import ParamsSelect from '@/components/ParamsSelect';
import FocusWrapper from '@/components/FocusWrapper';
import { useIdPathMap } from '@/hooks';
import { mapStateToProps, mapDispatchToProps } from './connect';
export interface CallbackManageRef {
  open: () => void;
}

export interface CallbackManageProps {
  onClose?: () => void;
}

const ComponentList = (props: {
  id: string;
  setSelect: (value: string[]) => void;
  randomKey: number;
}) => {
  const { id, setSelect } = props;
  const idPathMap = useIdPathMap();

  const count = useComponentNumber(id);

  const list = useMemo(() => {
    return Object.values(idPathMap).reduce<any>((acc, cur) => {
      const { filter, id: componentId, name } = cur;

      if (
        filter?.show &&
        filter?.value.some((item) => item.id === id && !item.disabled)
      ) {
        acc.push(
          <Button
            type="link"
            onClick={() => {
              setSelect([componentId]);
            }}
            key={componentId}
          >
            {name}
          </Button>,
        );
      }

      return acc;
    }, []);
  }, [idPathMap, id, setSelect, count]);

  return (
    <div
      style={{
        maxHeight: 200,
        overflow: 'auto',
      }}
    >
      {list.length ? list : <Empty description="暂无组件" />}
    </div>
  );
};

const ComponentListWrapper = connect(
  () => ({}),
  (dispatch) => {
    return {
      setSelect: (value: string[]) =>
        dispatch({ type: 'global/setSelect', value }),
    };
  },
)(ComponentList);

function useComponentNumber(id: string) {
  const idPathMap = useIdPathMap();

  const count = useMemo(() => {
    return Object.values(idPathMap).reduce((acc, cur) => {
      const { filter } = cur;

      if (
        filter?.show &&
        filter?.value.some((item) => item.id === id && !item.disabled)
      ) {
        acc++;
      }

      return acc;
    }, 0);
  }, [idPathMap, id]);

  return count || 0;
}

export const ComponentNumber = (props: { id: string }) => {
  const count = useComponentNumber(props.id);

  return <>{count || 0}</>;
};

const CallbackList = (props: {
  callback?: ComponentData.TFilterConfig[];
  setCallbackData?: (value: ComponentData.TFilterConfig[]) => void;
}) => {
  const { callback = [], setCallbackData } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const deleteData = useCallback(
    (value: ComponentData.TFilterConfig) => {
      const { id } = value;
      const newValue = callback.filter((item) => item.id !== id);
      setCallbackData?.(newValue);
    },
    [callback],
  );

  const updateCallback = useCallback(
    (record: ComponentData.TFilterConfig, value: string[]) => {
      const newValue = callback.map((item) => {
        if (record.id !== item.id) return item;
        return {
          ...item,
          params: value,
        };
      });
      setCallbackData?.(newValue);
    },
    [callback],
  );

  const previewCode = useCallback((value: string) => {
    setCode(value);
    setVisible(true);
  }, []);

  const copyData = useCallback(
    (value: ComponentData.TFilterConfig) => {
      setCallbackData?.([
        ...callback,
        {
          ...value,
          id: nanoid(),
          editable: false,
        },
      ]);
    },
    [setCallbackData, callback],
  );

  const columns = useMemo(() => {
    return [
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '代码',
        key: 'code',
        dataIndex: 'code',
        ellipsis: true,
        render: (value: string) => {
          return (
            <div
              title={value}
              className="c-po text-ellipsis"
              onClick={previewCode.bind(null, value)}
            >
              {value}
            </div>
          );
        },
      },
      {
        title: '关联参数',
        key: 'params',
        dataIndex: 'params',
        width: 150,
        render: (value: string[], record: ComponentData.TFilterConfig) => {
          return (
            <ParamsSelect
              value={value}
              onChange={updateCallback.bind(null, record)}
            />
          );
        },
      },
      {
        title: '使用组件',
        key: 'use',
        dataIndex: 'use',
        width: 100,
        render: (_: any, record: ComponentData.TFilterConfig) => {
          return <ComponentNumber id={record.id} />;
        },
      },
      {
        title: '操作',
        key: 'op',
        dataIndex: 'op',
        render: (_: any, record: ComponentData.TFilterConfig) => {
          return (
            <>
              <Popconfirm
                title="是否确定删除此过滤器？"
                onConfirm={deleteData.bind(null, record)}
              >
                <Button key="delete" type="link" style={{ paddingLeft: 0 }}>
                  删除
                </Button>
              </Popconfirm>
              <Button
                key="copy"
                type="link"
                onClick={copyData.bind(null, record)}
              >
                复制
              </Button>
            </>
          );
        },
      },
    ];
  }, [updateCallback, deleteData, copyData]);

  return (
    <FocusWrapper>
      <Table
        dataSource={callback}
        rowKey={(record) => record.id}
        columns={columns}
        pagination={false}
        scroll={{ y: '70vh' }}
        bordered
        size="small"
        expandable={{
          expandedRowRender: (record) => {
            return (
              <ComponentListWrapper id={record.id} randomKey={Math.random()} />
            );
          },
          expandIcon: ({ record, expanded, expandable, onExpand }) => {
            if (!expandable) return null;
            if (expanded) {
              return (
                <MinusSquareOutlined onClick={onExpand.bind(null, record)} />
              );
            }
            return (
              <Tooltip title="查看使用的组件">
                <PlusSquareOutlined onClick={onExpand.bind(null, record)} />
              </Tooltip>
            );
          },
        }}
      />
      <Modal
        title="过滤函数"
        onCancel={() => setVisible(false)}
        footer={null}
        open={visible}
        bodyStyle={{ padding: 0, fontSize: '12px' }}
      >
        <CodeViewer>{code}</CodeViewer>
      </Modal>
    </FocusWrapper>
  );
};

const WrapperCallbackList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CallbackList);

const CallbackManage = forwardRef<CallbackManageRef, CallbackManageProps>(
  (props, ref) => {
    const { onClose: propsOnClose } = props;

    const [visible, setVisible] = useState<boolean>(false);

    const onClose = useCallback(() => {
      setVisible(false);
      propsOnClose?.();
    }, []);

    const open = useCallback(() => {
      setVisible(true);
    }, []);

    const footer = useMemo(() => {
      return (
        <div className="ali-r">
          <Button onClick={onClose}>关闭</Button>
        </div>
      );
    }, [onClose]);

    useImperativeHandle(
      ref,
      () => {
        return {
          open,
        };
      },
      [open],
    );

    return (
      <Drawer
        mask={false}
        open={visible}
        maskClosable={false}
        onClose={onClose}
        footer={footer}
        title="回调管理"
        placement="left"
        width={680}
      >
        <WrapperCallbackList />
      </Drawer>
    );
  },
);

export default CallbackManage;
