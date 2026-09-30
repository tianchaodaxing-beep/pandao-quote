# 报价单生成器

编辑报价项目、折扣和税率，打印或导出报价单。

浏览器本机运行，无需注册，也无需配置付费接口。演示资料均为虚构示例。

[在线使用](https://tianchaodaxing-beep.github.io/pandao-quote/) · [下载版本](https://github.com/tianchaodaxing-beep/pandao-quote/releases/latest) · [全部工具](https://github.com/tianchaodaxing-beep/pandao-open-tools)

![界面预览](docs/preview.png)

## 开始使用

从版本页面下载工具压缩包，解压后双击 `index.html`。Windows 也可以双击 `启动工具.cmd`。需要保留整个目录，不能只复制HTML文件。

1. 填写供应方、客户、报价编号、币种和有效期。
2. 编辑项目、数量与单价，点击“生成报价”。
3. 打印时选择保存为PDF，或直接导出报价表格。

## 文件与数据

表格支持 `.xlsx`、`.xls`、`.csv`、`.tsv`；只读取第一个工作表。单表最多20,000行、10 MB。文字文件的支持范围以工具说明为准。

输入资料在浏览器本机处理，不会通过本工具上传到服务器；点击外部反馈链接时会打开GitHub。导出文件由使用者保管。当前版本不自动保存输入，关闭前请导出需要的结果。

## 使用范围

税额按折扣后的金额另加，报价单不属于税务发票。币种只作为报价单位，不自动转换金额。

## 开发与许可

使用 Node.js 20 或更新版本运行 `npm test`。运行网页无需安装Node.js或其他依赖。

本项目采用MIT许可证，允许商业使用、修改和分发，需保留许可声明。第三方表格库采用独立许可证，详见 THIRD_PARTY_NOTICES.md。

## 反馈与定制需求

请通过[项目问题区](https://github.com/tianchaodaxing-beep/pandao-quote/issues)描述使用场景、遇到的问题或希望增加的功能。公开反馈请使用演示资料，避免提交客户资料和账号凭据。
