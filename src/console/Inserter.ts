/*
 * @Author: wuqinfa
 * @Date: 2022-02-12 14:50:54
 * @LastEditTime: 2022-02-12 18:10:19
 * @LastEditors: wuqinfa
 * @Description: 根据用户选择的变量，插入 console.log
 */
import {
  commands,
  
  TextEditor,
  Selection,
  Position,
} from 'vscode';
import lodash from 'lodash';

// 存储需要插入 console 的行和对应的变量字符串
interface InsertLineAndText {
  line: number;
  texts: string[];
}

export default class Inserter {
  private editor: TextEditor;

  constructor(editor: TextEditor) {
    this.editor = editor;
  }

  async insert() {
    try {
      await commands.executeCommand('editor.action.addSelectionToNextFindMatch');

      const insertLineAndText: InsertLineAndText[] = this.getInsertLineAndText();
      const newSelections = insertLineAndText.map((item) => {
        const {
          line,
        } = item;
        return new Selection(line, 0, line, 0);
      });

      console.log('insertLineAndText', insertLineAndText);

      this.editor.selections = newSelections;

      await commands.executeCommand('editor.action.insertLineAfter');

      const positions: Position[] = [];

      this.editor.selections.forEach((item) => {
        positions.push(new Position(item.start.line, item.end.character));
      });

      this.editor.edit((editBuilder) => {
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

  private getInsertLineAndText(): InsertLineAndText[] {
    const result: InsertLineAndText[] = [];

    const selections = this.editor.selections;
    const ascSelections = lodash.orderBy(selections, 'start.line');
    const length = ascSelections.length;

    let tempLine: null | number = null;
    let tempText: string[] = [];

    console.log('ascSelections', ascSelections);

    ascSelections.forEach((item) => {
      const line = item.start.line;
      const text = this.editor.document.getText(item);

      if ((tempLine === null) || (line === tempLine) || (line === tempLine + 1)) {
        tempLine = line;
        tempText.push(text);
        return;
      }

      if (line !== (tempLine + 1)) {
        result.push({
          line: tempLine,
          texts: tempText,
        });

        tempLine = line;
        tempText = [text];
      }
    });

    if (tempLine !== null) {
      result.push({
        line: tempLine,
        texts: tempText,
      });
    }

    return result;
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
}