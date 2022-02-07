/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-02-07 12:07:27
 * @LastEditors: wuqinfa
 * @Description: 
 */
import {
  workspace,
  window,
  commands,
  languages,
  
  Uri,
  TextEditor,
  Selection,
  Range,
  Position,
} from 'vscode';
import lodash from 'lodash';

import * as vscode from 'vscode';

// 存储需要插入 console 的行和对应的变量字符串
interface InsertLineAndText {
  line: number;
  texts: string[];
}

export default class ConsoleGenerator {
  async execute(uri: Uri) {
    const editor = window.activeTextEditor;

    if (!editor) {
        window.showErrorMessage('还没打开编辑文档，不能插入 log');
        return;
    }

    // const tokenTypes = ['class', 'interface', 'enum', 'function', 'variable'];
    // const tokenModifiers = ['declaration', 'documentation'];
    // const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

    // const provider: vscode.DocumentSemanticTokensProvider = {
    //   provideDocumentSemanticTokens(
    //     document: vscode.TextDocument
    //   ): vscode.ProviderResult<vscode.SemanticTokens> {
    //     const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
    //     tokensBuilder.push(      
    //       new vscode.Range(new vscode.Position(0, 3), new vscode.Position(0, 8)),
    //       tokenTypes[0],
    //       [tokenModifiers[0]]
    //     );
    //     return tokensBuilder.build();
    //   }
    // };

 

    this.insertConsole(editor);
  }

  private async insertConsole(editor: TextEditor) {
    try {
      await commands.executeCommand('editor.action.addSelectionToNextFindMatch');

      const insertLineAndText: InsertLineAndText[] = this.getInsertLineAndText(editor);
      const newSelections = insertLineAndText.map((item) => {
        const {
          line,
        } = item;
        return new Selection(line, 0, line, 0);
      });

      console.log('insertLineAndText', insertLineAndText);

      editor.selections = newSelections;

      await commands.executeCommand('editor.action.insertLineAfter');

      const positions: Position[] = [];

      editor.selections.forEach((item) => {
        positions.push(new Position(item.start.line, item.end.character));
      });

      editor.edit((editBuilder) => {
        positions.forEach((position, index) => {
          const texts = insertLineAndText[index].texts;
          const length = texts.length;
          const tab = this.getTab(position.character);

          let txt = '';

          texts.forEach((item, subIndex) => {
            if (subIndex !== (length - 1)) {
              txt += `console.log('${item} :>> ', ${item});\n${tab}`;
              return;
            }

            txt += `console.log('${item} :>> ', ${item});`;
          });

          editBuilder.insert(position, txt);
        });
      });

    } catch (error) {
      
    }
  }

  // TODO: 目前只是处理了空格制表符的情况，对于其它制表符，还没处理
  private getTab(size: number): string {
    let result = '';
    let index = 0;

    while (index < size) {
      result += ' ';
      index++;
    }

    return result;
  }

  private getInsertLineAndText(editor: TextEditor): InsertLineAndText[] {
    const result: InsertLineAndText[] = [];

    const selections = editor.selections;
    const ascSelections = lodash.orderBy(selections, 'start.line');
    const length = ascSelections.length;

    let tempLine: null | number = null;
    let tempText: string[] = [];

    console.log('ascSelections', ascSelections);

    ascSelections.forEach((item, index) => {
      const line = item.start.line;
      const text = editor.document.getText(item);

      if (tempLine === null) {
        tempText.push(text);
        tempLine = line;
        return;
      }

      // TODO: 像函数参数这种，在同一样的情况还没兼容到

      if (line !== (tempLine + 1)) {
        result.push({
          line: tempLine,
          texts: tempText,
        });

        tempText = [];
      }

      tempText.push(text);
      tempLine = line;

      if (index === (length - 1)) {
        result.push({
          line: line,
          texts: tempText,
        });
      }
    });

    return result;
  }

}