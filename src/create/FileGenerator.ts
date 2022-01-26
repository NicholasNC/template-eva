/*
 * @Author: your name
 * @Date: 2022-01-01 14:44:33
 * @LastEditTime: 2022-01-26 23:32:39
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

import wxappPage from './template/wxappPage';

const EMBED_PREFIX = '$yutucc$-'; // 内置的关键词的前缀
const EMBED_TEMPLATE_WXAPPPAGE = `${EMBED_PREFIX}wxappPage`; // 内置模板 - 微信小程序页面  关键字


export interface FileTemplate {
  fileName: string;
  description: string;
}

interface TemplateObj {
  path: string; // 模板的路径
  ext: string; // 如果模板是文件，就有后缀名，如果是文件夹，就没有后缀
}

export default class FileGenerator {
  async execute(uri: Uri) {
    const targetDir = uri.fsPath;
    const template: QuickPickItem | undefined = await this.selectTemplatePrompt();
    const newFileName = await this.inputNamePrompt() || '';

    const {
      detail: templateName = '',
    } = template || {};

    if (!template || !templateName || !newFileName) {
      return;
    }

    // 插入内置的模板
    if (templateName.includes(EMBED_PREFIX)) {
      this.insertEmbedTemplate(targetDir, templateName, newFileName);
      return;
    }

    const templateObj = this.getTemplate(targetDir, templateName);

    this.copyTemplate(templateObj, targetDir, newFileName);

    return;
  }

  private insertEmbedTemplate(targetDir: string, templateName: string, newFileName: string) {
    switch (templateName) {
      case EMBED_TEMPLATE_WXAPPPAGE:
        this.insertEmbedWxappPage(targetDir, newFileName);
        break;
    
      default:
        break;
    }
  }

  private insertEmbedWxappPage(targetDir: string, newFileName: string) {
    const targetPath = path.join(targetDir, newFileName);
    const isTargetExists = fse.pathExistsSync(targetPath);

    if (isTargetExists) {
      window.showErrorMessage('目前路径上已存在该文件');
      return;
    }

    fse.ensureDirSync(targetPath);

    try {
      fs.writeFileSync(
        path.join(targetPath, 'index.js'),
        wxappPage.jsStr
      );
      fs.writeFileSync(
        path.join(targetPath, 'index.json'),
        wxappPage.jsonStr
      );
      fs.writeFileSync(
        path.join(targetPath, 'index.wxml'),
        wxappPage.wxmlStr
      );
      fs.writeFileSync(
        path.join(targetPath, 'index.wxss'),
        wxappPage.wxssStr
      );

      window.showInformationMessage('创建成功');
    } catch (error) {
      window.showErrorMessage(' 创建失败');
    }
  }

  /**
   * 将模板复制到目标路径上
   * @param templateObj getTemplate 函数返回值
   * @param targetDir 目标路径
   * @param newFileName 新文件的文件名
   */
  private copyTemplate(templateObj: TemplateObj | null, targetDir: string, newFileName: string) {
    if (!templateObj) {
      return;
    }

    const {
      path: templatePath,
      ext: templateExt,
    } = templateObj;
    const targetPath = path.join(targetDir, templateExt ? `${newFileName}${templateExt}` : newFileName);

    fse.copy(templatePath, targetPath, {
      overwrite: false,
      errorOnExist: true,
    })
    .then(() => {
      window.showInformationMessage('创建成功');
    })
    .catch(() => {
      window.showErrorMessage('目前路径上已存在该文件');
    });
  }

  /**
   * 获取模板文件的路径
   * @param targetDir 目标路径
   * @param templateName 模板文件的文件名
   * @returns TemplateObj | null
   */
  private getTemplate(targetDir: string, templateName: string): TemplateObj | null {
    let result = null;

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
      const ext = path.extname(templatePath);

      try {
        const stat = fs.lstatSync(templatePath);
        const isFile = stat.isFile();

        result = {
          path: templatePath,
          ext: isFile ? ext : '',
        };
      } catch (error) {
        // 执行 lstatSync 报错，说明模板路径不存在
        window.showErrorMessage('模板不存在');
      }
    }

    return result;
  }

  protected async selectTemplatePrompt(): Promise<QuickPickItem | undefined> {
    const config = workspace.getConfiguration('template-eva');
    const fileTemplates: FileTemplate[] | undefined = config.get<FileTemplate[]>('fileTemplates');
    const isNeedEmbedWxappPage: boolean = config.get('embedTemplate.wxappPage') || false; // 是否需要内置的微信小程序页面模板

    if (!fileTemplates || !fileTemplates.length) {
      window.showErrorMessage('没有模板文件');
      return;
    }

    const picks: QuickPickItem[] = fileTemplates.map((item) => ({
      label: item.description,
      detail: item.fileName,
    }));

    if (isNeedEmbedWxappPage) {
      picks.unshift({
        label: '内置模板 - 微信小程序页面',
        detail: EMBED_TEMPLATE_WXAPPPAGE,
      });
    }

    return window.showQuickPick(picks, {
      ignoreFocusOut: true,
      placeHolder: '请选择模板',
      title: '这个是什么？',
      onDidSelectItem(item: QuickPickItem): QuickPickItem {
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
        if (/[\s]/.test(name)) {
          return '不能输入空格';
        }
        return null;
      },
      prompt: '文件名'
    });
  }
}