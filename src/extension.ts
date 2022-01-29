/*
 * @Author: your name
 * @Date: 2021-12-26 14:11:31
 * @LastEditTime: 2022-01-29 10:23:47
 * @LastEditors: wuqinfa
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/extension.ts
 */
import * as vscode from 'vscode';

import ImgGenerator from './insert/ImgGenerator';
import LoremGenerator from './insert/LoremGenerator';

import FileGenerator from './create/FileGenerator';

import ConsoleGenerator from './console/ConsoleGenerator';


/**
 * 一旦你的插件激活，vscode会立刻调用下述方法
 *    只会在你的插件激活时执行一次
 */
export function activate(context: vscode.ExtensionContext) {
  const avatar = new ImgGenerator('avatar');
  const image = new ImgGenerator('image');
  const lorem = new LoremGenerator();
  const file = new FileGenerator();
  const console = new ConsoleGenerator();

  context.subscriptions.push(
    vscode.commands.registerCommand('template-eva.insertAvatar', () => {
      avatar.execute();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('template-eva.insertImage', () => {
      image.execute();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('template-eva.insertLorem', () => {
      lorem.execute();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('template-eva.createFile', (uri: vscode.Uri) => {
      file.execute(uri);
    })
  );
  
  context.subscriptions.push(
    vscode.commands.registerCommand('template-eva.insertLogStatement', (uri: vscode.Uri) => {
      console.execute(uri);
    })
  );
}

/**
 * 插件关闭时调用下述方法
 */
export function deactivate() {}
