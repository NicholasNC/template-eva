/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-02-12 15:27:14
 * @LastEditors: wuqinfa
 * @Description: 
 */
import {
  window,
} from 'vscode';
import { parse } from 'recast';

import Inserter from './Inserter';
import Commenter from './Commenter';

export default class ConsoleGenerator {
  async execute(type: 'insertConsole' | 'addConsoleComment' | 'delConsoleComment') {
    const editor = window.activeTextEditor;

    if (!editor) {
        window.showErrorMessage('还没打开编辑文档，不能插入 log');
        return;
    }

    let ast = null;
    let consoleCommenter = null;

    if (type === 'addConsoleComment' || type === 'delConsoleComment') {
      ast = parse(editor.document.getText());
      consoleCommenter = new Commenter(editor, ast);
    }

    switch (type) {
      case 'insertConsole':
        const consoleInserter = new Inserter(editor);
        consoleInserter.insert();
        break;
      case 'addConsoleComment':
        consoleCommenter?.add();
        break;
      case 'delConsoleComment':
        consoleCommenter?.del();
        break;
      default:
        break;
    }
  }

}