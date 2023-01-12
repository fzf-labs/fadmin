import { buildSuffixSvgUrl } from '/@/api/common'

/**
 * 表格和表单中文件预览图的生成
 */
export const previewRenderFormatter = (row: TableRow, column: TableColumn, cellValue: string) => {
    const imgSuffix = ['gif', 'jpg', 'jpeg', 'bmp', 'png', 'webp']
    if (imgSuffix.includes(cellValue)) {
        return row.full_url
    }
    return buildSuffixSvgUrl(cellValue)
}

export const previewSizeFormatter = (value: string) => {
    const size = parseFloat(value)
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (size / Math.pow(1024, i)).toFixed(i < 1 ? 0 : 2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
}
