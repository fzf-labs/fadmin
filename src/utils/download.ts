import axios from "axios";

// 下载文件（可解决跨域下载问题）
export async function downloadFile(fileUrl: string) {
    if (!fileUrl) return;
    const res = await axios({
        method: "get",
        url: fileUrl,
        responseType: "blob"
    });
    const newUrl = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = newUrl;
    a.download = getFileName(fileUrl);
    a.click();
    a.remove();
    //在资源下载完成后 可以人工清除createObjectURL 占用的缓存资源
    window.URL.revokeObjectURL(newUrl);
}

//获取文件名称
export function getFileName(url: string) {
    let name: string;
    if (url !== null && url !== "") {
        name = url.substring(url.lastIndexOf("/") + 1);
    } else {
        name = "unknown";
    }
    return name;
}
