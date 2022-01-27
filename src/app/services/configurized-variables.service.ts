import { Injectable } from '@angular/core';
import { AppSettings } from './app-settings';

@Injectable()
export class ConfigurizedVariablesService {


  constructor(private appSettings: AppSettings) { }

  replaceVariablesInText(text: string, varname: string): string{
    var textReplaced = text;

    return textReplaced.replace(this.createRegex(varname), function(matched){
      return this.appSettings.variables[varname][matched];
  });
  }

  private createRegex(name: string): RegExp{
    const regex = new RegExp(Object.keys(this.appSettings.variables[name]).join("|"),"g");
    return regex;
  }

}