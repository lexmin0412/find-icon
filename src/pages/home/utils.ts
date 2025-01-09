import { message } from "antd"

interface IApiConfigData {
  apiUrl?: string
  apiSecret?: string
  workflowId?: string
}

// 扣子工作流 API
const apiUrl = 'https://api.coze.cn/v1/workflow/run'
// 扣子工作流 ID
const workflowId = '7456740588374999075'

/**
 * API 配置
 */
class ApiConfigConstructor {
  getConfig() {
		return {
      apiUrl,
			apiSecret: localStorage.getItem('FIND_ICON_API_KEY'),
      workflowId
		} as IApiConfigData
  }

  setConfig(apiSecret: string) {
		localStorage.setItem('FIND_ICON_API_KEY', apiSecret)
  }
}

export const ApiConfig = new ApiConfigConstructor()

/**
 * 运行工作流
 */
export const runWorkflow = async(params: {
  input: string
  type: string
  lib: string
}) => {
  const result = await fetch(ApiConfig.getConfig().apiUrl!, {
    method: 'POST',
    body: JSON.stringify({
      workflow_id: ApiConfig.getConfig().workflowId,
      parameters: params
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ApiConfig.getConfig().apiSecret}`,
    },
  }).then((res)=>res.json())
  const { code, data, msg } = result
  if (code !== 0) {
    switch (code) {
      case 4013:
        message.error('已达到调用频率上线，请稍后再试')
        break;
      default:
        message.error(`调用失败: ${msg}`)
        break;
    }
    return []
  }
  try {
    const parsedOuterData = JSON.parse(data)
    const parsedData = JSON.parse(parsedOuterData.data)
    return parsedData
  } catch (error) {
    message.error('解析数据失败')
    console.error('解析数据失败', error)
    return []
  }
}
