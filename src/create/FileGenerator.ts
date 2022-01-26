/*
 * @Author: your name
 * @Date: 2022-01-01 14:44:33
 * @LastEditTime: 2022-01-26 16:49:11
 * @LastEditors: wuqinfa
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/create/FileGenerator.ts
 */
import {
  workspace,
  window,
  
  QuickPickItem,
  Uri,
} from 'vscode';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';



export interface FileTemplate {
  fileName: string;
  description: string;
}



export default class FileGenerator {
  async execute(uri: Uri) {
    console.log('uri :>> ', uri);

    const targetDir = uri.fsPath;
    const template = await this.selectTemplatePrompt();
    const name = await this.inputNamePrompt();

    console.log('template :>> ', template);
    console.log('name :>> ', name);

    const {
      detail: templateName,
    } = template;

    // const apDirname = path.join(targetDir, templateName);
    // const rpPirname = path.join(targetDir, `.vscode/.template-eva/${templateName}`);

    // const isExistsApDirname = fs.existsSync(apDirname);
    // const isExistsRpPirname = fs.existsSync(rpPirname);

    // if (!isExistsApDirname || !isExistsRpPirname) {
    //   throw new Error('模板不存在');
    // }

    const templatePath = this.getTemplatePath(targetDir, templateName);

    if (!templatePath) {
      return;
    }

    const targetPath = path.join(targetDir, name);

    fse.copy(templatePath, targetPath, {
      overwrite: false,
      errorOnExist: true,
    })
    .then(() => {
      console.log('success!');
    })
    .catch(err => {
      console.error(err);
    });



    return;
  }

  /**
   * 获取模板文件的路径
   */
  private getTemplatePath(targetDir: string, templateName: string): string {
    let result = '';

    const workspaceFolders = workspace.workspaceFolders || [];

    for (const item of workspaceFolders) {
      const {
        path: rootDir, // 工作空间的根目录路径
      } = item.uri || {};
      const tempRootDir = path.join(`${rootDir}/`);
      const tempTargetDir = path.join(`${targetDir}/`);

      /*
        如果目标路径不包含工作空间的根目录路径，说明不在该工作空间中插入，直接跳到下一个循环
        ps: 之所以要  path.join(`${rootDir}/`) ，加上 / 是为了避免两个工作空间的内容有包含的情况，比如：
          "/Users/nicholas/Desktop/test"
          "/Users/nicholas/Desktop/test-imgs"
       */
      if (!tempTargetDir.includes(tempRootDir)) {
        continue;
      }

      const templatePath = path.join(rootDir, `.vscode/.template-eva/${templateName}`);
      const isExists = fs.existsSync(templatePath);

      if (isExists) {
        result = templatePath;
        break;
      }
    }

    return result;
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