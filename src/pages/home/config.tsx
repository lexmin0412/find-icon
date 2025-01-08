
import * as AntDesignIcons from "@ant-design/icons/lib/icons";
import * as AntDesignMobileIcons from 'antd-mobile-icons'
import * as MaterialUIIcons from "@mui/icons-material";

export const LibConfig = {
  'Ant Design': {
    iconList: Object.entries(AntDesignIcons),
    filter: (type: string, list) => {
      return list.filter(([name]) => name.endsWith(type))
    },
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
    iconList: Object.entries(AntDesignMobileIcons),
    filter: (type: string, list) => {
      return list.filter(([name]) => name.endsWith(type))
    },
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
  },
  'Material UI': {
    iconList: Object.entries(MaterialUIIcons),
    filter: (type: string, list) => {
      if (type === 'Filled') {
        // 如果是实底，过滤掉 Outlined、Rounded、Sharp、TwoTone 后缀
        return list.filter(([name]) => {
          return !['Outlined', 'Rounded', 'Sharp', 'TwoTone'].some((suffix) => name.endsWith(suffix))
        })
      }
      return list.filter(([name]) => name.endsWith(type))
    },
    typeOptions: [
      {
        value: "Filled",
        label: "实底风格",
      },
      {
        value: "Outlined",
        label: "线框风格",
      },
      {
        value: "Rounded",
        label: "圆角风格",
      },
      {
        value: "Sharp",
        label: "锐化风格",
      },
      {
        value: "TwoTone",
        label: "双色风格",
      },
    ]
  }
}