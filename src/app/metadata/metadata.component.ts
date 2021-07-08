import { AccountService } from './../services/account.service';
import { DialogCitationComponent } from './../dialog/dialog-citation/dialog-citation.component';
import { DialogAuthosComponent } from './../dialog/dialog-authors/dialog-authors.component';
import { AppSettings } from './../services/app-settings';
import { Metadata } from './../model/metadata.model';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MzModalService } from 'ngx-materialize';
import { AnalyticsService } from '../services/analytics.service';
import { DialogShareComponent } from '../dialog/dialog-share/dialog-share.component';
import { DialogAdminMetadataComponent } from '../dialog/dialog-admin-metadata/dialog-admin-metadata.component';
import { DialogPolicyComponent } from '../dialog/dialog-policy/dialog-policy.component';
import { DialogAdminComponent } from '../dialog/dialog-admin/dialog-admin.component';
import { AuthService } from '../services/auth.service';
import { LicenceService } from '../services/licence.service';
import { SimpleChanges } from '@angular/core';
import { BookService } from '../services/book.service';
import { DialogLicencesComponent } from '../dialog/dialog-licences/dialog-licences.component';

@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html'
})
export class MetadataComponent implements OnInit, OnChanges{
  public controlsEnabled = true;

  @Input() set showControls(value: boolean) {
    this.controlsEnabled = value;
  }
  @Input() metadata: Metadata;
  showingTitle = false;

  expand = {}
  lock;

  constructor(private modalService: MzModalService,
              public analytics: AnalyticsService,
              public account: AccountService,
              public bookService: BookService,
              private licences: LicenceService,
              public auth: AuthService,
              public settings: AppSettings) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.metadata && changes.metadata.currentValue) {
      if (!this.metadata.isPublic) {
        this.lock = this.licences.buildLock(this.metadata.licences);
      }
    }
  }

  showTitle() {
    this.showingTitle = !this.showingTitle;
  }

  showMetadata() {
    return this.show('metadata');
  }

  showSharing() {
    return this.show('share');
  }

  showCitation() {
    return this.show('citation');
  }


  openAdminActions() {
    this.modalService.open(DialogAdminComponent, { metadata: this.metadata } );
  }

  onShowAuthors() {
    this.analytics.sendEvent('metadata', 'authors');
    this.modalService.open(DialogAuthosComponent, { authors: this.metadata.authors} );
  }

  showLicenceDialog() {
    if (this.licences.on()) {
      this.modalService.open(DialogLicencesComponent, { licences: this.metadata.licences, full: true });
    } else {
      this.modalService.open(DialogPolicyComponent, { type: 'private' } );
    }
  }

  onShowCitation() {
    this.analytics.sendEvent('metadata', 'citation');
    this.modalService.open(DialogCitationComponent, { metadata: this.metadata });
  }

  onShare() {
    this.analytics.sendEvent('metadata', 'share');
    this.modalService.open(DialogShareComponent, { metadata: this.metadata });
  }

  onShowMetadata() {
    this.analytics.sendEvent('metadata', 'admin-metadata');
    this.modalService.open(DialogAdminMetadataComponent, { metadata: this.metadata } );
  }

  private show(action: string): boolean {
    if (this.metadata.licence) {
      const l = this.licences.action(this.metadata.licence, action);
      if (l == 1) {
        return true;
      } else if (l == 2) {
        return false;
      }
    }
    const value = this.settings.actions[action];
    return value === 'always' || (value === 'public' && this.metadata.isPublic);
  }

}
