/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-02-12 15:03:11
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
import * as recast from 'recast';

import Inserter from './Inserter';

export default class ConsoleGenerator {
  async execute(type: 'insertConsole' | 'addConsoleComment' | 'delConsoleComment') {
    const editor = window.activeTextEditor;

    if (!editor) {
        window.showErrorMessage('还没打开编辑文档，不能插入 log');
        return;
    }

    switch (type) {
      case 'insertConsole':
        const consoleInserter = new Inserter(editor);
        consoleInserter.insert();
        break;
      case 'addConsoleComment':
        this.addConsoleComment(editor);
        break;
      case 'delConsoleComment':
        this.delConsoleComment(editor);
        break;
    
      default:
        break;
    }
  }

  private getConsoleSelections(editor: TextEditor): Selection[] {
    const ast = recast.parse(editor.document.getText());
    const result: Selection[] = [];

    try {
      recast.visit(ast, {
        visitExpressionStatement: ({ node }) => {
          const callee = node.expression.callee;
  
          if (!callee) {
            return false;
          }
          if ((callee?.object?.name !== 'console') && (callee?.name !== 'log')) {
            return false;
          }
  
          const loc = node.expression.loc;
          const start = new Position(loc.start.line - 1, loc.start.column);
          const end = new Position(loc.end.line - 1, loc.end.column);
          const selection = new Selection(start, end);
  
          result.push(selection);
  
          return false;
        },
      });
    } catch (error) {
      return result;
    }

    return result;
  }

  private getConsoleCommentSelections(editor: TextEditor): Selection[] {
    const ast = recast.parse(editor.document.getText());
    const logRegex = /console.(log|debug|info|warn|error|exception|assert|dirxml|dir|table|trace|groupCollapsed|groupEnd|group|timeEnd|time|profileEnd|profile|count)/g;
    const result: Selection[] = [];

    try {
      recast.visit(ast, {
        visitComment: ({ node }) => {
          const comments = node.comments || [];

          comments.forEach((item: any) => {
            const {
              loc,
              type,
              value,
            } = item;

            if (type === 'Block' && logRegex.test(value)) {
              const start = new Position(loc.start.line - 1, loc.start.column);
              const end = new Position(loc.end.line - 1, loc.end.column);
              const selection = new Selection(start, end);

              result.push(selection);
            }
          });
  
          return false;
        },
      });
    } catch (error) {
      return result;
    }

    return result;
  }

  private addConsoleComment(editor: TextEditor) {
    const newSelections = this.getConsoleSelections(editor);

    if (!newSelections?.length) {
      return;
    }

    try {
      editor.selections = newSelections;

      commands.executeCommand('editor.action.blockComment');
    } catch (error) {
      
    }
  }

  private delConsoleComment(editor: TextEditor) {
    const newSelections = this.getConsoleCommentSelections(editor);

    if (!newSelections?.length) {
      return;
    }

    try {
      editor.selections = newSelections;

      commands.executeCommand('editor.action.blockComment');
    } catch (error) {
      
    }
  }


  

  

}