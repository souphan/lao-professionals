import { Component, OnInit } from '@angular/core';
import { IdeaService, Idea } from 'src/app/services/idea.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
}