' BYZM 联机服务器 - 无窗口后台启动脚本
' 由 install-autostart.bat 调用，开机自启时隐藏窗口运行
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = fso.GetParentFolderName(WScript.ScriptFullName)
sh.Run "node index.js", 0, False
