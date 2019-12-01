import { Component, OnInit } from '@angular/core';
import { IdeaService, Professional } from 'src/app/services/idea.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { delay,tap, map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.page.html',
  styleUrls: ['./idea-list.page.scss'],
})
export class IdeaListPage implements OnInit {
 
  professionals: Observable<any[]>;
 
  constructor(private ideaService: IdeaService,
    private router: Router,
    private route: ActivatedRoute) { }
 
  ngOnInit() {
    this.professionals = this.ideaService.getProfessionals();
  }

  filterList(evt) {  
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.professionals = this.professionals.filter(pro => {
      if (pro.goalName && searchTerm) {
        if (pro.goalName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
}