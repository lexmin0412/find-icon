import { useMount, useRequest } from "ahooks";
import {
  Card,
  Dropdown,
  Input,
  Segmented,
  Space,
  Spin,
} from "antd";
import * as Icons from "@ant-design/icons";
import { FunctionComponent, useState } from "react";
import CopyWrapper from "@/components/copy-wrapper";

type IIconType = "Outlined" | "Filled" | "TwoTone";

const iconTypeOptions = [
  {
    value: "Outlined",
    label: "线框风格",
  },
  {
    value: "Filled",
    label: "实底风格",
  },
  {
    value: "TwoTone",
    label: "双色风格",
  },
];

const DefaultIconType = iconTypeOptions[0].value as IIconType

function Home() {
  const [iconType, setIconType] = useState<IIconType>(DefaultIconType);

  useMount(()=>{
    handleFakeFetch({iconType: DefaultIconType})
  })

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleIcons, setVisibleIcons] = useState<
    Array<[string, FunctionComponent]>
  >([]);

  const { loading: fetchLoading, runAsync: handleFakeFetch } = useRequest(
    (options?: { iconType: IIconType }) => {
      // 将 filteredIcons 按照类型分组

      const allIcons = Object.entries(Icons).filter(
        ([name]) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (name.endsWith("Outlined") ||
            name.endsWith("Filled") ||
            name.endsWith("TwoTone"))
      );

      const filterType = options?.iconType || (iconType as string);
      const result = allIcons.filter(([name]) => name.endsWith(filterType));

      return new Promise((resolve) => {
        setTimeout(() => {
          setVisibleIcons(result);
          resolve(result);
        }, 500);
      });
    },
    {
      manual: true,
      onSuccess: (res) => {
        console.log("请求结果", res);
        // message.success("请求成功");
      },
    }
  );

  return (
    <div className="pt-36 mx-36">
      <div className="text-center mb-6 text-5xl font-bold">Find Icon</div>
      <div className="mb-12 text-center text-gray-600">
        Find icon compatible with{" "}
        <Dropdown
          arrow
          menu={{
            items: [
              {
                label: "Ant Design",
                key: "antd",
              },
            ],
          }}
        >
          <span className="text-blue-700">Ant Design <Icons.SwapOutlined className="text-sm" /></span>
        </Dropdown>
      </div>
      <div className="flex items-center">
        <Segmented
          value={iconType}
          onChange={(value) => {
            setIconType(value as IIconType);
            handleFakeFetch({
              iconType: value as IIconType,
            });
          }}
          options={iconTypeOptions}
        />
        <Input.Search
          placeholder="尽量简短地描述你的图标"
          className="w-full ml-3"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          onSearch={()=>{
            handleFakeFetch({iconType})
          }}
        />
      </div>

      <Spin spinning={fetchLoading}>
        <Space wrap className="mt-6">
          {visibleIcons.map(([name, Icon]) => {
            return (
              <CopyWrapper key={name} content={`<${name} />`}>
                <Card
                  key={name}
                  className="w-[150px] text-center hover:bg-blue-600 hover:text-white cursor-pointer text-gray-800"
                >
                  <Icon className="text-4xl" />
                  <p className="mt-2.5 text-xs">
                    {name.replace("Outlined", "")}
                  </p>
                </Card>
              </CopyWrapper>
            );
          })}
        </Space>
      </Spin>
    </div>
  );
}

export default Home;
