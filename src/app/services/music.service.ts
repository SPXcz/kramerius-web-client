import { SoundUnit } from './../model/soundunit.model';
import { Track } from './../model/track.model';
import { KrameriusApiService } from './kramerius-api.service';
import { LocalStorageService } from './local-storage.service';
import { ModsParserService } from './mods-parser.service';
import { SolrService } from './solr.service';
import { DocumentItem } from './../model/document_item.model';
import { PeriodicalItem } from './../model/periodicalItem.model';
import { Injectable } from '@angular/core';
import { Metadata } from '../model/metadata.model';

@Injectable()
export class MusicService {

  audio;
  activeTrack: Track;
  coverImageUuid: string;
  soundUnitIndex = 0;
  uuid: string;
  metadata: Metadata;
  document: DocumentItem;
  state: MusicState = MusicState.None;
  tracks: Track[] = [];
  soundUnits: SoundUnit[] = [];
  playing: boolean;
  canPlay: boolean;
  trackPosition: number;
  trackDuration: number;
  trackPositionText: string;
  trackDurationText: string;

  public activeMobilePanel: String;


  constructor(private solrService: SolrService,
    private modsParserService: ModsParserService,
    private localStorageService: LocalStorageService,
    private krameriusApiService: KrameriusApiService) {
  }

  init(uuid: string) {
    this.clear();
    this.uuid = uuid;
    this.state = MusicState.Loading;
    this.krameriusApiService.getItem(uuid).subscribe((item: DocumentItem) => {
      this.document = item;
      this.krameriusApiService.getMods(this.document.root_uuid).subscribe(response => {
        this.metadata = this.modsParserService.parse(response);
        this.metadata.doctype = 'soundrecording';
        this.localStorageService.addToVisited(this.document, this.metadata);
        this.loadSoundUnits();
      });
    });
  }


  private loadSoundUnits() {
    this.krameriusApiService.getChildren(this.uuid).subscribe((units) => {
      for (const unit of units) {
        if (unit['model'] === 'soundunit') {
          this.soundUnits.push(new SoundUnit(unit['pid'], unit['title']));
        } else if (!this.coverImageUuid && unit['model'] === 'page') {
          this.coverImageUuid = unit['pid'];
        }
      }
      this.soundUnitIndex = 0;
      if (!this.coverImageUuid && this.soundUnits.length > 0) {
        this.coverImageUuid = this.soundUnits[0].uuid;
      }
      this.loadTrack();
    });
  }


  private loadTrack() {
    if (this.soundUnitIndex < this.soundUnits.length) {
      const unit = this.soundUnits[this.soundUnitIndex];
      this.krameriusApiService.getChildren(unit['uuid']).subscribe((tracks) => {
        for (const track of tracks) {
          if (track['model'] === 'track') {
            this.tracks.push(new Track(track['pid'], track['title'], unit, track['policy'] === 'public'));
          }
        }
        this.soundUnitIndex += 1;
        this.loadTrack();
      });
    } else {
      this.state = MusicState.Success;
      this.nextTrack();
    }
  }

  isActiveTrack(track: Track): boolean {
    return this.activeTrack === track;
  }

  nextTrack() {
    if (this.tracks.length === 0) {
      return;
    }
    if (!this.activeTrack) {
      this.changeTrack(this.tracks[0]);
    } else {
      let index = 0;
      for (const track of this.tracks) {
        if (track === this.activeTrack) {
          break;
        }
        index += 1;
      }
      index += 1;
      if (index >= this.tracks.length) {
        index = 0;
      }
      return this.changeTrack(this.tracks[index]);
    }
  }


  selectTrack(track: Track) {
    if (track === this.activeTrack) {
      if (this.isPlaying()) {
        this.pauseTrack();
      } else {
        this.playTrack();
      }
    } else {
      this.changeTrack(track);
    }
  }



  changeTrack(track: Track) {
    this.trackPosition = -1;
    this.trackDuration = -1;
    this.trackPositionText = '';
    this.trackDurationText = '';
    this.canPlay = false;
    if (!track) {
      return;
    }
    this.activeTrack = track;
    const url = this.krameriusApiService.getMp3Url(this.activeTrack.uuid);
    if (this.audio) {
      this.audio.setAttribute('src', url);
    } else {
      this.audio = new Audio(url);
    }
    this.audio.ontimeupdate = () => {
      this.trackPosition = Math.round(this.audio.currentTime);
      this.trackPositionText = this.formatTime(this.trackPosition);
    };
    this.audio.onloadedmetadata = () => {
      this.trackDuration = Math.round(this.audio.duration);
      this.trackDurationText = this.formatTime(this.trackDuration);
    };
    this.audio.onended = () => {
      this.nextTrack();
    };
    this.audio.oncanplay = () => {
      this.canPlay = true;
      this.playTrack();
    };
  }

  isPlaying(): boolean {
    return this.playing;
  }

  playTrack() {
    if (this.audio && this.canPlay) {
      this.playing = true;
      this.audio.play();
    }
  }

  pauseTrack() {
    if (this.audio && this.canPlay) {
      this.playing = false;
      this.audio.pause();
    }
  }

  changeTrackPosition(value: number) {
    this.audio.currentTime = value;
  }


  getCoverImageUrl(): string {
    return this.krameriusApiService.getThumbUrl(this.coverImageUuid);
  }

  getSoundUnitImageUrl(): string {
    if (this.activeTrack) {
      return this.krameriusApiService.getThumbUrl(this.activeTrack.unit.uuid);
    }
  }

  hasCoverImage(): boolean {
    return this.coverImageUuid !== null;
  }

  getAlbumTitle(): string {
    return this.metadata.getTitle();
  }

  getAlbumAuthor(): string {
    if (this.metadata.authors.length > 0) {
      return this.metadata.authors[0].name;
    }
    return '';
  }

  clear() {
    this.state = MusicState.None;
    this.metadata = null;
    this.document = null;
    this.state = MusicState.None;
    this.tracks = [];
    this.soundUnits = [];
    this.soundUnitIndex = 0;
    this.coverImageUuid = null;
    this.activeTrack = null;
    this.pauseTrack();
    this.audio = null;
    this.trackPosition = -1;
    this.trackDuration = -1;
    this.trackPositionText = '';
    this.trackDurationText = '';
    this.playing = false;
    this.canPlay = false;
    this.activeMobilePanel = 'player';
  }

  isStateSuccess(): boolean {
    return this.state === MusicState.Success;
  }

  isStateFailure(): boolean {
    return this.state === MusicState.Failure;
  }

  isStateLoading(): boolean {
    return this.state === MusicState.Loading;
  }



  private formatTime(secs: number) {
    const hr  = Math.floor(secs / 3600);
    const min = Math.floor((secs - (hr * 3600)) / 60);
    const sec = Math.floor(secs - (hr * 3600) -  (min * 60));
    const m = min < 10 ? '0' + min : '' + min;
    const s = sec < 10 ? '0' + sec : '' + sec;
    const h = hr > 0 ? hr + ':' : '';
    return h + m + ':' + s;
  }

}


export enum MusicState {
  Success, Loading, Failure, None
}