export const previewSizeFormatter = (value: string) => {
    const size = parseFloat(value)
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (size / Math.pow(1024, i)).toFixed(i < 1 ? 0 : 2) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i]
}
