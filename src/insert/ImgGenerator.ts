/*
 * @Author: your name
 * @Date: 2021-12-26 14:21:54
 * @LastEditTime: 2021-12-26 20:38:02
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/insert/ImgGenerator.ts
 */
import * as vscode from 'vscode';

import TextGenerator from './TextGenerator';

export default class ImgGenerator extends TextGenerator {
  private configKey: string;

  constructor(configKey: string) {
    super(false); // 插入头像，不需要让用户再输入参数

    this.configKey = configKey;
  }
  
  protected generate(): string | undefined {
    const config = vscode.workspace.getConfiguration('template-eva');
    const url: string | undefined = config.get(this.configKey);
    
    if (url) {
      return url;
    }

    vscode.window.showErrorMessage(`no ${this.configKey} in config`);
  }
}