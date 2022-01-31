/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-01-31 10:27:16
 * @LastEditors: wuqinfa
 * @Description: 
 */
import {
  workspace,
  window,
  commands,
  
  Uri,
  TextEditor,
  Selection,
  Range,
  Position,
} from 'vscode';
import lodash from 'lodash';

export default class ConsoleGenerator {
  async execute(uri: Uri) {
    const editor = window.activeTextEditor;

    if (!editor) {
        window.showErrorMessage('还没打开编辑文档，不能插入 log');
        return;
    }

    try {
      await commands.executeCommand('editor.action.addSelectionToNextFindMatch');

      const endOfBlock = this.getEndLineAndText(editor);
      const newSelections = endOfBlock.map((item) => {
        const {
          line,
        } = item;
        return new Selection(line, 0, line, 0);
      });

      editor.selections = newSelections;

      await commands.executeCommand('editor.action.insertLineAfter');

      const positions: any[] = [];

      editor.selections.forEach((item) => {
        positions.push(new Position(item.start.line, item.end.character));
      });

      editor.edit((editBuilder) => {
        positions.forEach((position, index) => {
          const texts = endOfBlock[index].texts;
          const length = texts.length;

          let txt = '';

          texts.forEach((item, subIndex) => {
            if (subIndex !== (length - 1)) {
              txt += `console.log('${item} :>> ', ${item});\n`;
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

  // {
  //   line: 1,
  //   texts: []
  // }

  private getEndLineAndText(editor: TextEditor): any[] {
    const result: any[] = [];

    const selections = editor.selections;
    const ascSelections = lodash.orderBy(selections, 'start.line');
    const length = ascSelections.length;

    let tempLine: null | number = null;
    let tempText: any[] = [];

    ascSelections.forEach((item, index) => {
      const line = item.start.line;
      const text = editor.document.getText(item);

      if (tempLine === null) {
        tempText.push(text);
        tempLine = line;
        return;
      }

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