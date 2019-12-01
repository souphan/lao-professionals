import { Component, OnInit } from '@angular/core';
import { IdeaService, Professional } from 'src/app/services/idea.service';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-idea-list',
  templateUrl: './idea-list.page.html',
  styleUrls: ['./idea-list.page.scss'],
})
export class IdeaListPage implements OnInit {
 
  professionals: Observable<any[]>;
 
  constructor(private ideaService: IdeaService) { }
 
  ngOnInit() {
    this.professionals = this.ideaService.getProfessionals();
  }
}