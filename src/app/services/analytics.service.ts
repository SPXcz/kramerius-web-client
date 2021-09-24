import { Injectable } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo';
import { AppSettings } from './app-settings';

@Injectable()
export class AnalyticsService {

  constructor(
    private setting: AppSettings,
    private matomoTracker: MatomoTracker
  ) { }

  sendEvent(category: string, action: string, label: string = '') {
    if (this.setting.ga) {
      // console.log('analytics', 'sending ga event ' + category + ' - ' + action + ' - ' + label);
      (<any>window).gaaa('send', 'event', category, action, label);
    }
    if (this.setting.matomo) {
      // console.log('analytics', 'sending matomo event ' + category + ' - ' + action + ' - ' + label);
      this.matomoTracker.trackEvent(category, action, label);
    }
  }

  sendPageView(url: string) {
    if (this.setting.ga) {
      // console.log('analytics', 'sending ga page ' + url);
      (<any>window).gaaa('set', 'page', url);
      (<any>window).gaaa('send', 'pageview');
    }
    if (this.setting.matomo) {
      // console.log('analytics', 'sending matomo page ' + url);
      this.matomoTracker.trackPageView(url);
    }
  }

}
