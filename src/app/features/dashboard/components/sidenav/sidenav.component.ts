import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @Output() logoutEvent: EventEmitter<void> = new EventEmitter<void>();

  isExpanded: boolean = true;
  links = [
    { title: 'Gallery', path: 'gallery', icon: 'images' },
    { title: 'CRUD', path: 'crud', icon: 'build' },
    { title: 'Comments', path: 'comments', icon: 'comments' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  public logout(): void {
    this.logoutEvent.emit();
  }
}
