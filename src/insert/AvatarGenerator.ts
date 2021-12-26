/*
 * @Author: your name
 * @Date: 2021-12-26 14:21:54
 * @LastEditTime: 2021-12-26 15:19:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/insert/AvatarGenerator.ts
 */
import * as vscode from 'vscode';

import TextGenerator from './TextGenerator';

export default class AvatarGenerator extends TextGenerator {
  constructor() {
    super(false); // 插入头像，不需要让用户再输入参数
  }
  
  protected generate(): string | undefined {
    const config = vscode.workspace.getConfiguration('template-eva');
    const src: string | undefined = config.get('avatar');
    // if (src) {
    //   switch (src) {
    //     case "pravatar":
    //       return `http://i.pravatar.cc/${size}`;
    //   }
    // }
    vscode.window.showErrorMessage('eee');
  }
}