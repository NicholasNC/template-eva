/*
 * @Author: your name
 * @Date: 2021-12-29 22:22:42
 * @LastEditTime: 2021-12-29 22:27:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/insert/LoremGenerator.ts
 */
import * as vscode from 'vscode';

import TextGenerator from './TextGenerator';

export default class LoremGenerator extends TextGenerator {

  constructor() {
    super(true);
  }
  
  protected generate(count: number): string | undefined {
    const config = vscode.workspace.getConfiguration('template-eva');
    const characters: string | undefined = config.get('lorem');
    
    if (!characters) {
      vscode.window.showErrorMessage('没配置默认字符');
      return;
    }
    if (count <= characters.length) {
      return characters.slice(0, count);
    }

    const repeat = Math.floor(count / characters.length);
    const mod = count % characters.length;
    
    return (
      Array(repeat)
        .fill(characters)
        .join('') + characters.slice(0, mod)
    );
  }
}