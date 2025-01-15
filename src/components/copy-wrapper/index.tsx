import { message } from 'antd'

import { copyToClipboard } from '@toolkit-fe/clipboard'

interface ICopyWrapperProps {
	/**
	 * 要复制的内容
	 */
	content: string
	/**
	 * 子元素
	 */
	children: React.ReactNode
}

/**
 * 复制容器
 */
export default function CopyWrapper(props: ICopyWrapperProps) {
	const { content, children } = props

	if (!children) {
		return null
	}

	return (
		// <Tooltip
		// 	title="点击复制"
		// 	placement="topLeft"
		// >
			<span
				className="inline-block w-full hover:underline hover:text-white hover:decoration-dashed cursor-pointer"
				onClick={async () => {
					await copyToClipboard(content)
					message.success(`已复制 ${content}`)
				}}
			>
				{children}
			</span>
		// </Tooltip>
	)
}
