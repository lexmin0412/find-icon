import { message } from "antd"

interface IApiConfigData {
  apiUrl?: string
  apiSecret?: string
  workflowId?: string
}

/**
 * API 配置
 */
class ApiConfigConstructor {
  getConfig() {
    return JSON.parse(localStorage.getItem('apiConfig') || '{}') as IApiConfigData
  }

  setConfig(config: IApiConfigData) {
    localStorage.setItem('apiConfig', JSON.stringify(config))
  }
}

export const ApiConfig = new ApiConfigConstructor()

/**
 * 运行工作流
 */
export const runWorkflow = async(params: {
  input: string
  type: string
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
  const { code, data } = result
  if (code !== 0) {
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