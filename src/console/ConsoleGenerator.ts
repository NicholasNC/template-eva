/*
 * @Author: wuqinfa
 * @Date: 2022-01-29 10:17:18
 * @LastEditTime: 2022-01-29 10:24:39
 * @LastEditors: wuqinfa
 * @Description: 
 */
import {
  workspace,
  window,
  
  QuickPickItem,
  Uri,
} from 'vscode';

export default class ConsoleGenerator {
  async execute(uri: Uri) {
    console.log('object :>> ', 1111);
  }

}