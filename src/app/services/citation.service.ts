
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from './app-settings';
import { Translator } from 'angular-translator';

@Injectable()
export class CitationService {

    constructor(private http: HttpClient, private appSettings: AppSettings, private translator: Translator) {
    }

    getCitation(uuid: string): Observable<string> {
        const lang = this.translator.language;
        const url = `https://citace.kramerius.cloud/v1/kramerius?url=${this.appSettings.url}&uuid=${uuid}&format=html&lang=${lang}`;
        return this.doGetText(url);
    }

    private doGetText(url: string): Observable<string> {
        return this.http.get(encodeURI(url), { observe: 'response', responseType: 'text' })
        .map(response => response['body']);
    }

}
