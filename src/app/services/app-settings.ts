import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var APP_GLOBAL: any;

@Injectable()
export class AppSettings {

  private listner = new Subject<KrameriusData>();
  kramerius$ = this.listner.asObservable();

  public multiKramerius: boolean;
  public currentCode: string;

  public title: string;
  public subtitle: string;
  public logo: string;
  public logoHome: string;
  public url: string;
  public schemaVersion: string;
  public code: string;
  public richCollections: boolean;
  public joinedDoctypes: boolean;
  public doctypes: string[];
  public filters: string[];
  public iiifEnabled: boolean;
  public k3: string;
  public customRightMessage: boolean;
  public originLink: boolean;
  public mapSearch: boolean;
  public hiddenLocks: boolean;
  public localAuth: any;
  public variables: any;

  public static langs = ['cs', 'en', 'de', 'sk'];
  public licences: any;
  public ga = APP_GLOBAL.ga;
  public matomo = APP_GLOBAL.matomo;
  public maxOmnibusParts: number;
  public maxOmnibusPages: number;

  public k7: boolean;


  public share_url = APP_GLOBAL.share_url;
  public googleMapsApiKey = APP_GLOBAL.googleMapsApiKey;
  public enablePeriodicalVolumesYearsLayout = APP_GLOBAL.enablePeriodicalVolumesYearsLayout;
  public enablePeriodicalIsssuesCalendarLayout = APP_GLOBAL.enablePeriodicalIsssuesCalendarLayout;
  public defaultPeriodicalVolumesLayout = APP_GLOBAL.defaultPeriodicalVolumesLayout;
  public defaultPeriodicalIsssuesLayout = APP_GLOBAL.defaultPeriodicalIssuesLayout;
  public publicFilterDefault = APP_GLOBAL.publicFilterDefault;
  public auth = APP_GLOBAL.auth;
  public bigHomeLogo = APP_GLOBAL.bigHomeLogo;
  public hideHomeTitle = APP_GLOBAL.hideHomeTitle;
  public advancedSearch = false;
  public aboutPage : [string, string] = APP_GLOBAL.aboutPage;
  public faqPage : [string, string] = APP_GLOBAL.faqPage;
  public footer : [string, string] = APP_GLOBAL.footer;
  public krameriusLogin = !!APP_GLOBAL.krameriusLogin;
  public landingPage = !!APP_GLOBAL.landingPage;
  public languages: string[] = APP_GLOBAL.languages || ['cs', 'en', 'de', 'sk'];

  public actions = {
    'pdf': AppSettings.action('pdf', 'always'), 
    'print': AppSettings.action('print', 'always'), 
    'jpeg': AppSettings.action('jpeg', 'always'), 
    'text': AppSettings.action('text', 'always'), 
    'metadata': AppSettings.action('metadata', 'always'), 
    'citation': AppSettings.action('citation', 'always'), 
    'share': AppSettings.action('share', 'always'), 
    'selection': AppSettings.action('selection', 'always'), 
    'crop': AppSettings.action('crop', 'always')
  }

  public newestAll = !!APP_GLOBAL.newestAll;
  public crossOrigin = !!APP_GLOBAL.crossOrigin;

  public krameriusList: KrameriusData[];
  public krameriusVsList = APP_GLOBAL.krameriusVsList;

  constructor() {
    this.krameriusList = [];
    for (const k of APP_GLOBAL.krameriusList) {
      this.krameriusList.push(k);
    }
    this.multiKramerius = this.krameriusList.length > 1;
    this.assignKrameriusByIndex(0);
  }

  public assignKrameriusByCode(code: string): boolean {
    if (this.currentCode === code) {
      return true;
    }
    const k = this.findCrameriusByCode(code);
    if (k) {
      this.assignKramerius(k);
      return true;
    }
    return false;
  }

  public findCrameriusByCode(code: string): KrameriusData {
    for (const k of this.krameriusList) {
      if (k.code === code) {
        return k;
      }
    }
  }

  public assignKrameriusByIndex(index: number) {
    const k = this.krameriusList[index];
    this.assignKramerius(k);
  }

  public assignKramerius(kramerius: KrameriusData) {
    this.code = kramerius.code;
    this.title = kramerius.title;
    this.subtitle = kramerius.subtitle;
    this.url = kramerius.url;
    this.schemaVersion = kramerius.schemaVersion || '1.0';
    this.logo = kramerius.logo || 'assets/img/logo.png'
    this.logoHome = kramerius.logoHome || this.logo;
    this.richCollections = kramerius.richCollections;
    this.joinedDoctypes = kramerius.joinedDoctypes;
    this.doctypes = kramerius.doctypes;
    this.filters = kramerius.filters || [];
    this.iiifEnabled = kramerius.iiif;
    this.k3 = kramerius.k3;
    this.originLink = kramerius.originLink;
    this.customRightMessage = kramerius.customRightMessage;
    this.mapSearch = !!kramerius.mapSearch;
    this.licences = kramerius.licences;
    this.hiddenLocks = !!kramerius.hiddenLocks;
    this.maxOmnibusPages = kramerius.maxOmnibusPages || 0;
    this.maxOmnibusParts = kramerius.maxOmnibusParts || 0;
    this.k7 = !!kramerius.k7;
    this.currentCode = this.code;
    this.localAuth = kramerius.localAuth || this.auth ;
    this.variables = kramerius.variables || {};
    this.listner.next(kramerius);
  }

  public getLogoByCode(code: string): string {
    const k = this.findCrameriusByCode(code);
    if (k) {
      return k.logo;
    }
    return null;
  }

  public getUrlByCode(code: string): string {
    const k = this.findCrameriusByCode(code);
    if (k) {
      return k.url;
    }
    return null;
  }

  public getPathPrefix(): string {
    if (!this.multiKramerius) {
      return '';
    }
    return '/' + this.code;
  }

  public getRouteFor(path: string): string {
    return this.getPathPrefix() + '/' + path;
  }

  public availableFilter(filter: string): boolean {
    return this.filters.indexOf(filter) > -1;
  }

  public k5Compat(): boolean {
    return this.schemaVersion === '1.0';
  }

  getToken() {
    return localStorage.getItem('auth.token.' + this.code);
  }

  setToken(token: string) {
    return localStorage.setItem('auth.token.' + this.code, token);
  }

  private static action(action: string, defaultValue: string): string {
    if (!APP_GLOBAL.actions) {
      return defaultValue;
    }
    return APP_GLOBAL.actions[action] || defaultValue;
  }

}

interface KrameriusData {
  code: string;
  title: string;
  subtitle: string;
  logo: string;
  logoHome: string;
  url: string;
  schemaVersion: string;
  richCollections: boolean;
  joinedDoctypes: boolean;
  doctypes: string[];
  filters: string[];
  iiif: boolean;
  k3: string;
  licences: any;
  originLink: boolean;
  customRightMessage: boolean;
  mapSearch: boolean;
  hiddenLocks: boolean;
  type: string;
  maxOmnibusParts: number;
  maxOmnibusPages: number;
  localAuth: any;
  variables: any;
  k7: boolean;
}
