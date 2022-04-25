import { useMemo, useState, useCallback } from 'react';
import { PageHeader, Input, Button, message } from 'antd';
import { SendOutlined, FundOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import classnames from 'classnames';
import FocusWrapper from '@/components/FocusWrapper';
import {
  previewScreen,
  postScreen,
  putScreen,
  previewScreenModel,
  postScreenModel,
  putScreenModel,
} from '@/services';
import { captureCover, captureCoverAndUpload } from '@/utils/captureCover';
import { goPreview, goPreviewModel } from '@/utils/tool';
import { useIsModelHash } from '@/hooks';
import { mapDispatchToProps, mapStateToProps } from './connect';
import styles from './index.less';

const Header = (props: {
  screenData: Exclude<ComponentData.TScreenData, 'components'>;
  components: ComponentData.TComponentData[];
  setScreen?: (data: ComponentMethod.GlobalUpdateScreenDataParams) => void;
}) => {
  const { screenData, setScreen, components } = props;
  const { name, _id, description, poster } = screenData || {};
  const [editMode, setEditMode] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const Title = useMemo(() => {
    if (editMode) {
      return (
        <Input
          className={styles['designer-page-header-title-active']}
          defaultValue={name}
          allowClear
          size="large"
          autoFocus
          onBlur={(e) => {
            setScreen?.({
              name: e.target.value,
            });
            setEditMode(false);
          }}
        />
      );
    }

    return (
      <div
        className={classnames(
          styles['designer-page-header-title'],
          'border-1',
          'border-r-4',
          'c-po',
          'text-ellipsis',
        )}
        onClick={setEditMode.bind(null, true, undefined)}
      >
        {name}
      </div>
    );
  }, [editMode, name, setScreen]);

  const isModel = useIsModelHash();

  const handlePreview = useCallback(async () => {
    if (fetchLoading) return;
    setFetchLoading(true);
    try {
      // 大屏预览或模板预览
      const requestMethod = isModel ? previewScreenModel : previewScreen;
      const linkMethod = isModel ? goPreviewModel : goPreview;
      await requestMethod({ _id: _id as string });
      linkMethod(_id as string);
    } catch (err) {
      message.info('操作失败');
    } finally {
      setFetchLoading(false);
    }
  }, [_id, fetchLoading, isModel]);

  const handleStore = useCallback(async () => {
    if (fetchLoading) return;

    try {
      let coverPoster = poster;
      if (!coverPoster) {
        // 截图
        const coverBlob = await captureCover('#panel-id');
        coverPoster = (await captureCoverAndUpload(coverBlob)) as any;
        setScreen?.({
          poster: coverPoster,
        });
      }

      const params = {
        _id,
        name,
        description,
        poster: coverPoster,
        flag: 'PC',
        data: JSON.stringify({
          ...screenData,
          poster: screenData.poster || coverPoster,
          components,
        }),
      };
      let method: any;
      // 模板
      if (isModel) {
        method = _id ? putScreenModel : postScreenModel;
      }
      // 大屏
      else {
        method = _id ? putScreen : postScreen;
      }

      const result = await method(params as any);
      message.success('保存成功');
      setScreen?.({
        _id: result as string,
      });
    } catch (err) {
      message.info('保存失败，请重试');
    } finally {
      setFetchLoading(false);
    }
  }, [
    components,
    description,
    fetchLoading,
    _id,
    name,
    poster,
    screenData,
    setScreen,
    isModel,
  ]);

  const extra = useMemo(() => {
    const previewButton = (
      <Button
        key="preview"
        size="large"
        title="预览"
        type="link"
        onClick={handlePreview}
        icon={<FundOutlined />}
      ></Button>
    );
    const storeButton = (
      <Button
        key="send"
        size="large"
        title="保存"
        type="link"
        onClick={handleStore}
        icon={<SendOutlined />}
      ></Button>
    );
    if (!_id) return [storeButton];
    return [previewButton, storeButton];
  }, [handlePreview, handleStore, _id]);

  return (
    <FocusWrapper>
      <PageHeader
        className={styles['designer-page-header']}
        title={Title}
        extra={extra}
        backIcon={false}
      ></PageHeader>
    </FocusWrapper>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
