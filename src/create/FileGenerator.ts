/*
 * @Author: your name
 * @Date: 2022-01-01 14:44:33
 * @LastEditTime: 2022-01-02 10:51:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/create/FileGenerator.ts
 */
import {
  workspace,
  window,
  
  QuickPickItem,
  Uri,
} from 'vscode';



export interface FileTemplate {
  fileName: string;
  description: string;
}



export default class FileGenerator {
  async execute(uri: Uri) {
    console.log('uri :>> ', uri);

    const template = await this.selectTemplatePrompt();
    const name = await this.inputNamePrompt();

    console.log('template :>> ', template);
    console.log('name :>> ', name);

    return;
  }

  protected async selectTemplatePrompt(): Promise<QuickPickItem | undefined> {
    const config = workspace.getConfiguration('template-eva');
    const fileTemplates: FileTemplate[] | undefined = config.get<FileTemplate[]>('fileTemplates');

    if (!fileTemplates || !fileTemplates.length) {
      window.showErrorMessage('没有模板文件');
      return;
    }

    const picks: QuickPickItem[] = fileTemplates.map((item) => ({
      label: item.description,
      detail: item.fileName,
    }));

    console.log('fileTemplates :>> ', fileTemplates);

    return window.showQuickPick(picks, {
      ignoreFocusOut: true,
      placeHolder: '请选择模板',
      title: '这个是什么？',
      onDidSelectItem(item: QuickPickItem): QuickPickItem {
        console.log('item :>> ', item);
        return item;
      },
    });
  }

  protected async inputNamePrompt(): Promise<string | undefined> {
    return window.showInputBox({
      ignoreFocusOut: true,
      placeHolder: '请输入需要新建文件的名字',
      validateInput(name: string): string | null {
        if (!name) {
          return '请输入名字';
        }
        // if (/[\\/:*?"<>|]/.test(name)) {
        //   return "Invalid Component name";
        // }
        if (/[\s]/.test(name)) {
          return '不能输入空格';
        }
        return null;
      },
      prompt: '文件名'
    });
  }
}