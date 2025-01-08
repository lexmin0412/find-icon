
import * as AntDesignIcons from "@ant-design/icons";
import * as AntDesignMobileIcons from 'antd-mobile-icons'

export const LibConfig = {
  'Ant Design': {
    iconList: AntDesignIcons,
    typeOptions: [
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
    ]
  },
  'Ant Design Mobile': {
    iconList: AntDesignMobileIcons,
    typeOptions: [
      {
        value: "Outline",
        label: "线框风格",
      },
      {
        value: "Fill",
        label: "实底风格",
      },
    ]
  }
}