import { useRequest } from "ahooks";
import {
  Card,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Segmented,
  Space,
  Spin,
} from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import CopyWrapper from "@/components/copy-wrapper";
import { ApiConfig, runWorkflow } from "./utils";
import { LibConfig } from "./config";
import { SettingOutlined, SwapOutlined } from "@ant-design/icons";

function Home() {
  const [iconType, setIconType] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [curLib, setCurLib] = useState<keyof typeof LibConfig>("Ant Design");

  const { typeOptions, iconList, filter } = LibConfig[curLib];

  useEffect(() => {
    if (!modalOpen) {
      form.resetFields();
    }
  }, [modalOpen]);

  useEffect(() => {
    setIconType(typeOptions[0].value);
    handleFakeFetch({
      iconType: typeOptions[0].value,
    });
  }, [curLib]);

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleIcons, setVisibleIcons] = useState<
    Array<[string, FunctionComponent]>
  >([]);

  const { loading: fetchLoading, runAsync: handleFakeFetch } = useRequest(
    (options?: { iconType: string }) => {
      const filterType = options?.iconType || (iconType as string);

      const allIcons = filter ? filter(filterType, iconList) : iconList;

      if (!searchTerm) {
        setVisibleIcons(allIcons);
        return;
      }

      return runWorkflow({
        input: searchTerm,
        type: filterType,
        lib: curLib,
      }).then((res) => {
        const result = allIcons.filter(([name]) => res.includes(name));
        setVisibleIcons(result);
        return result;
      });
    },
    {
      manual: true,
    }
  );

  return (
    <div className="pb-36 mx-36">
      <div className="flex items-center justify-end h-10">
        <SettingOutlined
          className="cursor-pointer"
          onClick={() => {
            setModalOpen(true);
            const configData = ApiConfig.getConfig();
            if (
              configData.apiUrl &&
              configData.apiSecret &&
              configData.workflowId
            ) {
              form.setFieldsValue(configData);
            }
          }}
        />
      </div>
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
      <div className="flex items-center">
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
        <Input.Search
          placeholder="尽量简短地描述你的图标"
          className="w-full ml-3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onSearch={() => {
            handleFakeFetch({ iconType });
          }}
        />
      </div>

      <Spin spinning={fetchLoading}>
        {visibleIcons?.length ? (
          <Space wrap className="mt-6">
            {visibleIcons.map(([name, Icon]) => {
              return (
                <CopyWrapper key={name} content={`<${name} />`}>
                  <Card
                    key={name}
                    className="w-[150px] text-center hover:bg-blue-600 hover:text-white cursor-pointer text-gray-800"
                  >
                    <Icon className="text-4xl" color="primary" />
                    <p className="mt-2.5 text-xs truncate">
                      {name.replace("Outlined", "")}
                    </p>
                  </Card>
                </CopyWrapper>
              );
            })}
          </Space>
        ) : (
          <Empty className="mt-6" description="暂无数据" />
        )}
      </Spin>

      <Modal
        title="配置工作流"
        open={modalOpen}
        destroyOnClose
        onCancel={() => setModalOpen(false)}
        onOk={async () => {
          await form.validateFields();
          const configData = form.getFieldsValue();
          ApiConfig.setConfig(configData);
          setModalOpen(false);
          message.success("保存成功，快试试搜索吧~");
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
          <Form.Item
            name="apiUrl"
            label="接口地址"
            rules={[{ required: true, message: "请输入api地址" }]}
          >
            <Input placeholder="请输入 api 地址" />
          </Form.Item>
          <Form.Item
            name="apiSecret"
            label="API Secret"
            rules={[{ required: true, message: "API Secret" }]}
          >
            <Input.TextArea placeholder="请输入 API Secret" />
          </Form.Item>
          <Form.Item
            name="workflowId"
            label="工作流 ID"
            rules={[{ required: true, message: "请输入工作流 ID" }]}
          >
            <Input placeholder="请输入工作流 ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
