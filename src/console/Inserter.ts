/*
 * @Author: wuqinfa
 * @Date: 2022-02-12 14:50:54
 * @LastEditTime: 2022-02-12 15:05:02
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

      const insertLineAndText: InsertLineAndText[] = this.getInsertLineAndText(this.editor);
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

    ascSelections.forEach((item, index) => {
      const line = item.start.line;
      const text = this.editor.document.getText(item);

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