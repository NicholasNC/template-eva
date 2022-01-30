/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-01-30 22:52:15
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

      console.log('object :>> ', 111);

      // const allSelText: string[] = this.getAllSelText(editor);
      const endOfBlock = this.getEndOfBlock(editor);
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

  // {
  //   line: 1,
  //   texts: []
  // }

  private getEndOfBlock(editor: TextEditor): any[] {
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



    // const tempLines = editor.selections.map((item) => {
    //   return item.start.line;
    // });
    // const allSelLines: number[] = lodash.orderBy(lodash.uniq(tempLines));
    // const length = allSelLines.length;

    // let tempLine: null | number = null;

    // allSelLines.forEach((line: number, index: number) => {
    //   if (tempLine === null) {
    //     tempLine = line;
    //     return;
    //   }

    //   if (line !== (tempLine + 1)) {
    //     result.push(tempLine);
    //   }

    //   tempLine = line;

    //   if (index === (length - 1)) {
    //     result.push(line);
    //   }
    // });

    return result;
  }

}