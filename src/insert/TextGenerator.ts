/*
 * @Author: your name
 * @Date: 2021-12-26 14:18:29
 * @LastEditTime: 2021-12-26 14:49:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /template-eva/src/insert/TextGenerator.ts
 */
import * as vscode from 'vscode';

export default abstract class TextGenerator {
  private isNeedPrompt: boolean;

  constructor(isNeedPrompt: boolean = false) {
    this.isNeedPrompt = isNeedPrompt;
  }

  protected prompt(): Promise<any> {
    return;
  }

  protected abstract generate(args: any): string | undefined;
  
  async execute() {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      return;
    }

    let args = null;

    if (this.isNeedPrompt) {
      args = await this.prompt();

      if (args === undefined) {
        return;
      }
    }

    const text = this.generate(args);

    // if (text) {
    //   editor.edit(edit =>
    //     editor.selections.forEach(selection => {
    //       edit.delete(selection);
    //       edit.insert(selection.start, text);
    //     })
    //   );
    // }
  }
}