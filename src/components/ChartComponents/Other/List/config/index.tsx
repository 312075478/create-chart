import { Component } from 'react';
import { Tabs, Select, Switch } from 'antd';
import { merge } from 'lodash';
import ComponentOptionConfig, {
  Tab,
} from '@/components/ChartComponents/Common/ComponentOptionConfig';
import { CompatColorSelect } from '@/components/ColorSelect';
import ConfigList from '@/components/ChartComponents/Common/Structure/ConfigList';
import { SingleCollapse as Collapse } from '@/components/ChartComponents/Common/Collapse';
import Input from '@/components/ChartComponents/Common/Input';
import FullForm from '@/components/ChartComponents/Common/Structure/FullForm';
import { FontConfigList } from '@/components/ChartComponents/Common/FontConfig';
import HalfForm from '@/components/ChartComponents/Common/Structure/HalfForm';
import MultipleSeriesConfig from '@/components/ChartComponents/Common/MultipleSeriesConfig';
import InputNumber from '@/components/ChartComponents/Common/InputNumber';
import { DEFAULT_FONT_CONFIG } from '../../../Common/Constants/defaultConfig';
import { TListConfig } from '../type';

const { TabPane } = Tabs;
const { Item } = ConfigList;

class Config extends Component<
  ComponentData.ComponentConfigProps<TListConfig>
> {
  onKeyChange = (key: keyof TListConfig, value: any) => {
    this.props.onChange({
      config: {
        options: {
          [key]: value,
        },
      },
    });
  };

  render() {
    const { value } = this.props;
    const {
      config: {
        data: { filter: { map = [] } = {} } = {},
        options: { global, header, index, columns },
      },
    } = value;

    return (
      <ComponentOptionConfig>
        <TabPane key={'1'} tab={<Tab>全局样式</Tab>}>
          <ConfigList level={1}>
            <Item label="列表显示行数">
              <FullForm>
                <InputNumber
                  className="w-100"
                  value={global.column}
                  onChange={(value) => {
                    this.onKeyChange('global', {
                      column: value,
                    });
                  }}
                />
              </FullForm>
            </Item>
            <Collapse
              child={{
                header: '动画',
                key: 'animation',
                visibleRender: true,
                value: global.animation.show,
                onChange: (value) => {
                  this.onKeyChange('global', {
                    animation: {
                      show: value,
                    },
                  });
                },
              }}
              parent={{
                activeKey: 'animation',
              }}
            >
              <Item label="滚动类型">
                <FullForm>
                  <Select
                    className="w-100"
                    value={global.animation.type}
                    onChange={(value) => {
                      this.onKeyChange('global', {
                        animation: {
                          type: value,
                        },
                      });
                    }}
                  >
                    {[
                      {
                        label: '逐条滚动',
                        value: 'column',
                      },
                      {
                        label: '整页滚动',
                        value: 'page',
                      },
                    ].map((item) => {
                      const { label, value } = item;
                      return (
                        <Select.Option key={value} value={value}>
                          {label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FullForm>
              </Item>
              <Item label="时间间隔">
                <FullForm>
                  <InputNumber
                    className="w-100"
                    value={global.animation.internal}
                    onChange={(value) => {
                      this.onKeyChange('global', {
                        animation: {
                          internal: value,
                        },
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Item label="低数据轮播">
                <FullForm>
                  <Switch
                    checked={global.animation.less}
                    onChange={(value) => {
                      this.onKeyChange('global', {
                        animation: {
                          less: value,
                        },
                      });
                    }}
                  />
                </FullForm>
              </Item>
            </Collapse>
          </ConfigList>
        </TabPane>
        <TabPane key={'2'} tab={<Tab>表头</Tab>}>
          <ConfigList level={1}>
            <Collapse
              child={{
                header: '表头',
                key: 'header',
                visibleRender: true,
                value: header.show,
                onChange: (value) => {
                  this.onKeyChange('header', {
                    show: value,
                  });
                },
              }}
              parent={{
                activeKey: ['header'],
              }}
            >
              <Item label="高度">
                <FullForm>
                  <InputNumber
                    className="w-100"
                    value={header.height}
                    onChange={(value) => {
                      this.onKeyChange('header', {
                        height: value,
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Item label="背景颜色">
                <FullForm>
                  <CompatColorSelect
                    value={header.backgroundColor}
                    onChange={(value) => {
                      this.onKeyChange('header', {
                        backgroundColor: value,
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Collapse
                child={{
                  header: '文本',
                  key: 'textStyle',
                }}
              >
                <FontConfigList
                  value={header.textStyle}
                  onChange={(value) => {
                    this.onKeyChange('header', {
                      textStyle: value,
                    });
                  }}
                />
              </Collapse>
            </Collapse>
          </ConfigList>
        </TabPane>
        <TabPane key={'3'} tab={<Tab>行</Tab>}>
          <ConfigList level={1}>
            <Item label="上下间距">
              <FullForm>
                <InputNumber
                  className="w-100"
                  value={columns.margin}
                  onChange={(value) => {
                    this.onKeyChange('columns', {
                      margin: value,
                    });
                  }}
                />
              </FullForm>
            </Item>
            <Collapse
              child={{
                header: '背景颜色',
                key: 'backgroundColor',
              }}
            >
              <Item label="奇行">
                <FullForm>
                  <CompatColorSelect
                    value={columns.odd.backgroundColor}
                    onChange={(value) => {
                      this.onKeyChange('columns', {
                        odd: {
                          backgroundColor: value,
                        },
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Item label="偶行">
                <FullForm>
                  <CompatColorSelect
                    value={columns.even.backgroundColor}
                    onChange={(value) => {
                      this.onKeyChange('columns', {
                        even: {
                          backgroundColor: value,
                        },
                      });
                    }}
                  />
                </FullForm>
              </Item>
            </Collapse>
            <MultipleSeriesConfig
              onAdd={() => {
                const newIndex = columns.data.length;
                const key = `fields_${newIndex + 1}`;
                const name = `字段_${newIndex + 1}`;
                const newData = {
                  key,
                  name,
                  width: 20,
                  type: 'text',
                  textStyle: {
                    ...DEFAULT_FONT_CONFIG,
                    fontSize: 14,
                    textAlign: 'center',
                  },
                  header: {
                    show: true,
                  },
                };
                const newDataList = [...columns.data, newData];
                this.onKeyChange('columns', {
                  data: newDataList,
                });

                // update fields
                const newMap: any = [
                  ...map,
                  {
                    field: key,
                    map: '',
                    description: name,
                    id: key,
                    type: 'string',
                  },
                ];
                this.props.onChange({
                  config: {
                    data: {
                      filter: {
                        map: newMap,
                      },
                    },
                  },
                });
              }}
              onRemove={(index) => {
                const newData = [...columns.data];
                newData.splice(index, 1);
                this.onKeyChange('columns', {
                  data: newData,
                });

                // update fields
                const newMap: any = [...map];
                newMap.splice(index, 1);
                this.props.onChange({
                  config: {
                    data: {
                      filter: {
                        map: newMap,
                      },
                    },
                  },
                });
              }}
              counter={columns.data.length}
              max={10}
              renderContent={(index) => {
                const { key, name, width, type, textStyle, header } =
                  columns.data[index];
                return (
                  <>
                    <Item label="字段">
                      <HalfForm label="key">
                        <Input
                          className="w-100"
                          value={key}
                          onChange={(value) => {
                            const newData = [...columns.data];
                            newData.splice(
                              index,
                              1,
                              merge(newData[index], {
                                key: value,
                              }),
                            );
                            this.onKeyChange('columns', {
                              data: newData,
                            });

                            const newMap: any = map.map((item) => {
                              const { field } = item;
                              if (field !== key) return item;
                              return {
                                ...item,
                                field: value,
                                id: value,
                              };
                            });
                            this.props.onChange({
                              config: {
                                data: {
                                  filter: {
                                    map: newMap,
                                  },
                                },
                              },
                            });
                          }}
                        />
                      </HalfForm>
                      <HalfForm label="name">
                        <Input
                          className="w-100"
                          value={name}
                          onChange={(value) => {
                            const newData = [...columns.data];
                            newData.splice(
                              index,
                              1,
                              merge(newData[index], {
                                name: value,
                              }),
                            );
                            this.onKeyChange('columns', {
                              data: newData,
                            });

                            const newMap: any = map.map((item) => {
                              const { field } = item;
                              if (field !== key) return item;
                              return {
                                ...item,
                                description: value,
                              };
                            });
                            this.props.onChange({
                              config: {
                                data: {
                                  filter: {
                                    map: newMap,
                                  },
                                },
                              },
                            });
                          }}
                        />
                      </HalfForm>
                    </Item>
                    <Item label="宽度（%）">
                      <FullForm>
                        <InputNumber
                          className="w-100"
                          value={width}
                          onChange={(value) => {
                            const newData = [...columns.data];
                            newData.splice(
                              index,
                              1,
                              merge(newData[index], {
                                width: value,
                              }),
                            );
                            this.onKeyChange('columns', {
                              data: newData,
                            });
                          }}
                        />
                      </FullForm>
                    </Item>
                    <Item label="内容类型">
                      <FullForm>
                        <Select
                          className="w-100"
                          value={type}
                          onChange={(value) => {
                            const newData = [...columns.data];
                            newData.splice(
                              index,
                              1,
                              merge(newData[index], {
                                type: value,
                              }),
                            );
                            this.onKeyChange('columns', {
                              data: newData,
                            });
                          }}
                          options={[
                            {
                              label: '文字',
                              value: 'text',
                            },
                            {
                              label: '图片',
                              value: 'value',
                            },
                          ]}
                        />
                      </FullForm>
                    </Item>
                    <Collapse
                      child={{
                        header: '文本',
                        key: 'textStyle',
                      }}
                    >
                      <FontConfigList
                        value={textStyle}
                        onChange={(value) => {
                          const newData = [...columns.data];
                          newData.splice(
                            index,
                            1,
                            merge(newData[index], {
                              textStyle: value,
                            }),
                          );
                          this.onKeyChange('columns', {
                            data: newData,
                          });
                        }}
                      />
                    </Collapse>
                    {/* 暂时不需要 */}
                    {/* <Collapse
                      child={{
                        header: '自定义表头',
                        key: 'column-header',
                        visibleRender: true,
                        value: header.show,
                        onChange: value => {
                          const newData = [...columns.data]
                          newData.splice(index, 1, merge(newData[index], {
                            header: {
                              show: value
                            }
                          }))
                          this.onKeyChange('columns', {
                            data: newData
                          })
                        }
                      }}
                    >
                      <Item
                        label='背景颜色'
                      >
                        <FullForm>
                          <CompatColorSelect
                            value={header.backgroundColor}
                            onChange={value => {
                              const newData = [...columns.data]
                              newData.splice(index, 1, merge(newData[index], {
                                header: {
                                  backgroundColor: value
                                }
                              }))
                              this.onKeyChange('columns', {
                                data: newData
                              })
                            }}
                          />
                        </FullForm>
                      </Item>
                      <Collapse
                        child={{
                          header: '文本',
                          key: 'column-header-textStyle'
                        }}
                      >
                        <FontConfigList
                          value={header.textStyle}
                          onChange={value => {
                            const newData = [...columns.data]
                            newData.splice(index, 1, merge(newData[index], {
                              header: {
                                textStyle: value
                              }
                            }))
                            this.onKeyChange('columns', {
                              data: newData
                            })
                          }}
                        />
                      </Collapse>
                    </Collapse> */}
                  </>
                );
              }}
              buttonLabel="新增字段"
              seriesLabel={(index) => {
                return columns.data[index]?.name || `字段${index + 1}`;
              }}
            />
          </ConfigList>
        </TabPane>
        <TabPane key={'4'} tab={<Tab>索引</Tab>}>
          <ConfigList level={1}>
            <Collapse
              child={{
                header: '索引',
                key: 'header',
                visibleRender: true,
                value: index.show,
                onChange: (value) => {
                  this.onKeyChange('index', {
                    show: value,
                  });
                },
              }}
            >
              <Item label="宽度（%）">
                <FullForm>
                  <InputNumber
                    className="w-100"
                    value={index.width}
                    onChange={(value) => {
                      this.onKeyChange('index', {
                        width: value,
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Item label="大小">
                <FullForm>
                  <InputNumber
                    className="w-100"
                    value={index.size}
                    onChange={(value) => {
                      this.onKeyChange('index', {
                        size: value,
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Item label="背景颜色">
                <FullForm>
                  <CompatColorSelect
                    value={index.backgroundColor}
                    onChange={(value) => {
                      this.onKeyChange('index', {
                        backgroundColor: value,
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Item label="圆角">
                <FullForm>
                  <InputNumber
                    className="w-100"
                    value={index.radius}
                    onChange={(value) => {
                      this.onKeyChange('index', {
                        radius: value,
                      });
                    }}
                  />
                </FullForm>
              </Item>
              <Collapse
                child={{
                  header: '文本',
                  key: 'textStyle',
                }}
              >
                <FontConfigList
                  value={index.textStyle}
                  onChange={(value) => {
                    this.onKeyChange('index', {
                      textStyle: value,
                    });
                  }}
                />
              </Collapse>
            </Collapse>
          </ConfigList>
        </TabPane>
      </ComponentOptionConfig>
    );
  }
}

export default Config;