/*
 * @Author: your name
 * @Date: 2021-12-26 14:11:31
 * @LastEditTime: 2021-12-29 22:36:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/extension.ts
 */
import * as vscode from 'vscode';

import ImgGenerator from './insert/ImgGenerator';
import LoremGenerator from './insert/LoremGenerator';


/**
 * 一旦你的插件激活，vscode会立刻调用下述方法
 *    只会在你的插件激活时执行一次
 */
export function activate(context: vscode.ExtensionContext) {
  const avatar = new ImgGenerator('avatar');
  const image = new ImgGenerator('image');
  const lorem = new LoremGenerator();

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
}

/**
 * 插件关闭时调用下述方法
 */
export function deactivate() {}
