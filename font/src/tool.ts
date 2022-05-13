import { ElMessage } from "element-plus";

export function copyToClip(contentArray: any[]) {
  var contents = "";
  for (var i = 0; i < contentArray.length; i++) {
    contents += contentArray[i] + "\n";
  }
  const textarea = document.createElement("textarea");
  textarea.value = contents;
  document.body.appendChild(textarea);
  textarea.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    ElMessage({ type: "success", message: "复制成功" });
  }
  document.body.removeChild(textarea);
}
