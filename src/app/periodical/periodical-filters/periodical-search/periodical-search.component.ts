import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PeriodicalService } from './../../../services/periodical.service';

@Component({
  selector: 'app-periodical-search',
  templateUrl: './periodical-search.component.html',
  styleUrls: ['./periodical-search.component.scss']
})
export class PeriodicalSearchComponent implements OnInit {

  query: string;

  constructor(public periodicalService: PeriodicalService, 
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      const text = queryParams.get('fulltext');
      this.query = text;
    });
  }
  
  search() {
    console.log(this.query + " - " + this.periodicalService.getFulltextQuery());
  }

}