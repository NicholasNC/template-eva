/*
 * @Author: your name
 * @Date: 2021-12-26 14:21:54
 * @LastEditTime: 2021-12-26 16:47:16
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
    const avatar: string | undefined = config.get('avatar');
    
    if (avatar) {
      return avatar;
    }

    vscode.window.showErrorMessage('no avatar in config"');
  }
}