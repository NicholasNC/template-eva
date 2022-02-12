/*
 * @Author: wuqinfa
 * @Date: 2022-02-12 15:07:07
 * @LastEditTime: 2022-02-12 15:55:10
 * @LastEditors: wuqinfa
 * @Description: 使用 recast 遍历 AST 节点
 */
import {
  Selection,
  Position,
} from 'vscode';
import lodash from 'lodash';
import { visit } from 'recast';

const LOG_REGEX = /console.(log|debug|info|warn|error|exception|assert|dirxml|dir|table|trace|groupCollapsed|groupEnd|group|timeEnd|time|profileEnd|profile|count)/g;

export default class RecastVisitor {
  private ast: any;

  constructor(ast: any) {
    this.ast = ast;
  }

  getConsoleSelections(): Selection[] {
    const result: Selection[] = [];

    try {
      visit(this.ast, {
        visitExpressionStatement: ({ node }) => {
          const callee = node.expression.callee;
  
          if (!callee || (callee?.object?.name !== 'console')) {
            return false;
          }
  
          const loc: any = node.expression.loc;
          const start = new Position(loc.start.line - 1, loc.start.column);
          const endLine = loc.end.line - 1;
          const endColumn = loc.end.column;
          const end = new Position(endLine, endColumn);
          const endNext = new Position(endLine, endColumn + 1); // 如果 console 表达式末尾有 ; 号，则 selection 的 end 用这个

          // 判断 console 表达式末尾有没有 ; 号
          const isSemicolonEnd = lodash.find(loc.tokens || [], (item: any) => {
            const {
              type,
              value,
              loc: tokensLoc,
            } = item;

            return (type === 'Punctuator')
              && (value === ';')
              && (tokensLoc.end.line === endLine + 1)
              && (tokensLoc.end.column === endColumn + 1);
          });

          const selection = new Selection(start, isSemicolonEnd ? endNext : end);
  
          result.push(selection);
  
          return false;
        },
      });
    } catch (error) {
      return result;
    }

    return result;
  }

  getConsoleCommentSelections(): Selection[] {
    const result: Selection[] = [];

    try {
      visit(this.ast, {
        visitComment: ({ node }) => {
          const comments = node.comments || [];

          comments.forEach((item: any) => {
            const {
              loc,
              type,
              value,
            } = item;

            if (type === 'Block' && LOG_REGEX.test(value)) {
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
}