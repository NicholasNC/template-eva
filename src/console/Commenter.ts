/*
 * @Author: wuqinfa
 * @Date: 2022-02-12 15:04:35
 * @LastEditTime: 2022-02-12 15:23:17
 * @LastEditors: wuqinfa
 * @Description: 添加 / 消除 console 表达式的注释
 */
import {
  commands,

  TextEditor,
} from 'vscode';

import RecastVisitor from './RecastVisitor';

export default class Commenter {
  private editor: TextEditor;
  private recastVisitor: any;

  constructor(editor: TextEditor, ast: any) {
    this.editor = editor;
    this.recastVisitor = new RecastVisitor(ast);
  }

  add() {
    const newSelections = this.recastVisitor.getConsoleSelections();

    if (!newSelections?.length) {
      return;
    }

    try {
      this.editor.selections = newSelections;

      commands.executeCommand('editor.action.blockComment');
    } catch (error) {}
  }

  del() {
    const newSelections = this.recastVisitor.getConsoleCommentSelections();

    if (!newSelections?.length) {
      return;
    }

    try {
      this.editor.selections = newSelections;

      commands.executeCommand('editor.action.blockComment');
    } catch (error) {}
  }
}