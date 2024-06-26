import { Component, OnInit } from '@angular/core';
import { TtsService } from '../../services/tts.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tts-dialog',
  templateUrl: './tts-dialog.component.html',
  styleUrls: ['./tts-dialog.component.scss']
})
export class TtsDialogComponent implements OnInit {

  language: string;
  voice;
  loading: any;

  dntLanguages = [];

  languages = ['en', 'cs', 'de', 'sk', 'sl', 'es', 'fr', 'pl', 'it', 'uk', 'ru', 'pt', 'lt', 'lv'];
  voices = {
    'en': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('en')),
    'de': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('de')),
    'cs': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('cs')),
    'sk': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('sk')),
    'sl': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('sl')),
    'es': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('es')),
    'pl': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('pl')),
    'it': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('it')),
    'uk': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('uk')),
    'ru': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('ru')),
    'pt': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('pt')),
    'lt': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('lt')),
    'lv': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('lv')),
    'fr': TtsService.openAIVoices.concat(TtsService.googleVoicesByLanguage('fr'))
  }

  constructor(
    private dialogRef: MatDialogRef<TtsDialogComponent>,
    private tts: TtsService) {
      this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.language = this.tts.ttsLanguage();
    const model = this.tts.ttsVoice().code;
    this.voice = this.voices[this.language].find(v => v.code === model);
    if (this.voice == null) {
      this.voice = this.voices[this.language][0];
    }
  }

  toggleDntLanguage(language: string) {
    if (this.loading == language) {
      return;
    }
    if (this.dntLanguages.includes(language)) {
      this.dntLanguages = this.dntLanguages.filter(l => l !== language);
    } else {
      this.dntLanguages.push(language);
    }
  }

  onLanguageChange(language: string) {
    this.language = language;
    this.voice = this.voices[this.language][0];
  }

  onVoiceChange(voice) {
    this.voice = voice;
  }

  save() {
    this.tts.stopTestTTS();
    localStorage.setItem('tts.language', this.language);
    localStorage.setItem('tts.source', this.voice.source);
    localStorage.setItem('tts.voice', this.voice.code);
    this.dialogRef.close();
  }

  close() {
    this.tts.stopTestTTS();
    this.dialogRef.close();
  }

  read(voice) {
    const text = this.getTestText(this.language);
    this.loading = voice;
    this.tts.testTTS(voice, text, () => {
      this.loading = null;
    });
  }

  private getTestText(language: string): string {
    switch (language) {
      case 'cs': return "Bylo nebylo, v daleké zemi, kde slunce svítí o něco jasněji, stála malebná vesnička.";
      case 'en': return "Once upon a time, in a faraway land where the sun shines a little brighter, there stood a picturesque village.";
      case 'de': return "Es war einmal, in einem fernen Land, wo die Sonne etwas heller schien, ein malerisches Dorf.";
      case 'sk': return "Kedysi dávno v ďalekej krajine, kde slnko svieti o niečo jasnejšie, stála malebná dedinka.";
      case 'sl': return "Nekoč je v daljni deželi, kjer malo bolj sije sonce, stala slikovita vas.";
      case 'es': return "Érase una vez, en una tierra lejana donde el sol brilla un poco más, había un pueblo pintoresco.";
      case 'fr': return "Il était une fois, dans un pays lointain où le soleil brille un peu plus, se dressait un village pittoresque.";
      case 'pl': return "Dawno, dawno temu, w odległej krainie, gdzie słońce świeci trochę jaśniej, stała malownicza wioska.";
      case 'it': return "C'era una volta, in una terra lontana dove il sole splende un po' più luminoso, sorgeva un pittoresco villaggio.";
      case 'uk': return "Давним-давно в далекій країні, де сонце світить трохи яскравіше, стояло мальовниче село.";
      case 'ru': return "Когда-то в далекой стране, где солнце светит немного ярче, стояла живописная деревня.";
      case 'pt': return "Era uma vez, numa terra distante onde o sol brilha um pouco mais forte, existia uma pitoresca aldeia.";
      case 'lt': return "Kadaise tolimame krašte, kur saulė šviečia kiek ryškiau, stovėjo vaizdingas kaimas.";
      case 'lv': return "Reiz tālā zemē, kur saule spīd nedaudz spožāk, stāvēja gleznains ciemats.";
      }
  }
}