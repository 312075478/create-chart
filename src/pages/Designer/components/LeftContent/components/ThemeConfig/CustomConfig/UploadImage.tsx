import { useState, useCallback } from 'react';
import { Upload, message } from 'antd';
import type { UploadFile } from 'antd';
import Color from 'color';
import { UploadButton } from '@/components/ImageUpload';
import getImageColor from '@/utils/getImageColor';
import styles from './index.less';

const UploadImage = (props: { onChange?: (value: string[][]) => void }) => {
  const { onChange } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange = useCallback(
    async ({ fileList }: any) => {
      if (fileList.length) {
        const [target] = fileList;
        setFileList([target]);
        try {
          const colorList = await getImageColor(target.originFileObj);
          onChange?.([
            colorList.slice(0, 6).map((item) => {
              return Color(item).hex();
            }),
          ]);
        } catch (err) {
          message.info('图片解析失败');
          setFileList([]);
        }
      } else {
        setFileList([]);
      }
    },
    [onChange],
  );

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      beforeUpload={() => false}
      accept="image/*"
      multiple={false}
      className={styles['designer-theme-config-custom-upload']}
    >
      {fileList.length >= 1 ? null : <UploadButton />}
    </Upload>
  );
};

export default UploadImage;
