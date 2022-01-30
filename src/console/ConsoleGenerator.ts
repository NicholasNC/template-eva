/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-01-30 21:48:17
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

      const allSelText: string[] = this.getAllSelText(editor);
      const endOfBlock = this.getEndOfBlock(editor);
      const newSelections = endOfBlock.map((item) => {
        return new Selection(item, 0, item, 0);
      });

      const selections = editor.selections;

    console.log('selections :>> ', selections);

      // editor.selections = newSelections;

      // await commands.executeCommand('editor.action.insertLineAfter');

      // const positionList = [];

      // editor.selections.forEach((range) => {
      //   positionList.push(new Position(range.start.line, range.end.character));
      // });

      // editor.edit((editBuilder) => {
      //   positionList.forEach((position, index) => {
      //       editBuilder.insert(position, '\nconsole.log(111)\nconsole.log(222)\n');
      //   });
      // });

      // console.log('allSelText :>> ', allSelText);
      // console.log('endOfBlock :>> ', endOfBlock);
      // console.log('positionList :>> ', positionList);
      // console.log('www :>> ', www);
    } catch (error) {
      
    }
  }

  private getAllSelText(editor: TextEditor): string[] {
    const result: string[] = [];

    editor.selections.forEach((item) => {
      result.push(editor.document.getText(item));
    });

    return result;
  }

  private getEndOfBlock(editor: TextEditor): number[] {
    const result: number[] = [];

    const tempLines = editor.selections.map((item) => {
      return item.start.line;
    });
    const allSelLines: number[] = lodash.orderBy(lodash.uniq(tempLines));
    const length = allSelLines.length;

    let tempLine: null | number = null;

    allSelLines.forEach((line: number, index: number) => {
      if (tempLine === null) {
        tempLine = line;
        return;
      }

      if (line !== (tempLine + 1)) {
        result.push(tempLine);
      }

      tempLine = line;

      if (index === (length - 1)) {
        result.push(line);
      }
    });

    return result;
  }

}