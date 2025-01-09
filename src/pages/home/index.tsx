import {useMount, useRequest} from "ahooks";
import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Row,
  Segmented,
  Spin,
} from "antd";
import {useEffect, useState} from "react";
import CopyWrapper from "@/components/copy-wrapper";
import {ApiConfig, runWorkflow} from "./utils";
import {LibConfig} from "./config";
import {InfoCircleFilled, SwapOutlined} from "@ant-design/icons";

function Home() {
  const [iconType, setIconType] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [showWarning, setShowWarning] = useState(false);

  const [curLib, setCurLib] = useState<keyof typeof LibConfig>("Ant Design");

  const {typeOptions, iconList, filter} = LibConfig[curLib];
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!modalOpen) {
      form.resetFields();
    }
  }, [modalOpen]);

  useMount(() => {
    const configData = ApiConfig.getConfig();
    if (!configData?.apiSecret) {
      setShowWarning(true);
    }
  });

  useEffect(() => {
    setIconType(typeOptions[0].value);
    handleFakeFetch({
      iconType: typeOptions[0].value,
    });
  }, [curLib]);

  const {
    loading: fetchLoading,
    runAsync: handleFakeFetch,
    data: visibleIcons,
  } = useRequest(
    (options?: {iconType: string, searchTerm?: string}) => {
      
      const searchValue = options?.searchTerm ?? searchTerm
      const filterType = options?.iconType || (iconType as string);

      const allIcons = filter ? filter(filterType, iconList) : iconList;

      if (!searchValue) {
        return allIcons.slice(0, 20);
      }

      const configData = ApiConfig.getConfig();

      if (!configData?.apiSecret) {
        return allIcons.filter(([name]) =>
          name.toLowerCase().includes(searchValue.toLowerCase())
        );
      }

      return runWorkflow({
        input: searchValue,
        type: filterType,
        lib: curLib,
      }).then((res) => {
        const result = allIcons.filter(([name]) => res.includes(name));
        return result;
      })
    },
    {
      manual: true,
    }
  );

  return (
    <div className="pb-4 xs:mx-0 w-full sm:w-auto sm:mx-4 md:mx-12 lg:mx-36">
      {showWarning ? (
        <div className="flex items-center h-10">
          <Alert
            banner
            message={
              <div className="flex items-center justify-center">
                <InfoCircleFilled className="text-orange-400" />
                <span className="px-1">
                  注意：你没有配置 API Secret，搜索时将使用文本匹配，无法调用知识库。
                </span>
                <Button
                  type="link"
                  className="cursor-pointer p-0"
                  onClick={() => {
                    setModalOpen(true);
                    const configData = ApiConfig.getConfig();
                    if (configData.apiSecret) {
                      form.setFieldsValue({
                        apiSecret: configData.apiSecret,
                      });
                    }
                  }}
                >
                  配置
                </Button>
              </div>
            }
            type="warning"
            className="flex-1"
            showIcon={false}
          />
        </div>
      ) : null}
      <div className="text-center mt-20 mb-6 text-5xl font-bold">Find Icon</div>
      <div className="mb-12 text-center text-gray-600">
        Find icon compatible with{" "}
        <Dropdown
          arrow
          menu={{
            items: Object.keys(LibConfig).map((key) => {
              return {
                label: key,
                key: key,
                onClick: () => {
                  setCurLib(key as keyof typeof LibConfig);
                },
              };
            }),
          }}
        >
          <span className="text-blue-700 cursor-pointer">
            {curLib} <SwapOutlined className="text-sm" />
          </span>
        </Dropdown>
      </div>
      <div className="sm:flex sm:items-center px-0 sm:mx-4 md:mx-auto">
        <div className="flex sm:inline-block justify-center">
          <Segmented
            value={iconType}
            onChange={(value) => {
              setIconType(value as string);
              handleFakeFetch({
                iconType: value as string,
              });
            }}
            options={typeOptions}
          />
        </div>
        <div className="w-full px-6 sm:px-0 box-border ml-0 sm:ml-3">
          <Input.Search
            placeholder="尽量简短地描述你的图标"
            className="w-full ml-auto sm:ml-0 mr-auto sm:mr-0 mt-3 sm:mt-0"
            onSearch={(value: string) => {
              setSearchTerm(value)
              handleFakeFetch({iconType, searchTerm: value});
            }}
          />
        </div>
      </div>

      <Spin spinning={fetchLoading}>
        {visibleIcons?.length ? (
          <div className="px-6 sm:px-0">
            <Row gutter={[16, 24]} className="mt-6">
            {visibleIcons.map(([name, Icon]) => {
              return (
                <Col
                  className="gutter-row"
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={4}
                  key={name}
                >
                  <CopyWrapper content={`<${name} />`}>
                    <Card
                      key={name}
                      className="w-full text-center hover:bg-blue-600 hover:text-white cursor-pointer text-gray-800 mx-auto"
                    >
                      <Icon className="text-4xl" color="primary" />
                      <p className="mt-2.5 text-xs truncate">
                        {name.replace("Outlined", "")}
                      </p>
                    </Card>
                  </CopyWrapper>
                </Col>
              );
            })}
          </Row>
          </div>
        ) : (
          <Empty className="mt-6" description="暂无数据" />
        )}
      </Spin>

      <Modal
        title="配置 API Secret"
        open={modalOpen}
        destroyOnClose
        onCancel={() => setModalOpen(false)}
        onOk={async () => {
          await form.validateFields();
          const configData = form.getFieldsValue();
          ApiConfig.setConfig(configData.apiSecret);
					setShowWarning(false)
          setModalOpen(false);
          message.success("配置成功，快试试搜索吧~");
        }}
      >
        <Form
          form={form}
          layout="vertical"
          className="my-6"
          labelCol={{
            span: 5,
          }}
        >
          {/* <Form.Item
            name="apiUrl"
            label="接口地址"
            rules={[{required: true, message: "请输入api地址"}]}
          >
            <Input placeholder="请输入 api 地址" />
          </Form.Item> */}
          <Form.Item
            name="apiSecret"
            label="API Secret"
            rules={[{required: true, message: "API Secret"}]}
          >
            <Input.TextArea placeholder="请输入 API Secret" />
          </Form.Item>
          {/* <Form.Item
            name="workflowId"
            label="工作流 ID"
            rules={[{required: true, message: "请输入工作流 ID"}]}
          >
            <Input placeholder="请输入工作流 ID" />
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
