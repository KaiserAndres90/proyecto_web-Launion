import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() heading = 'Navegación';
  @Input() items: readonly SidebarItem[] = [];
  @Input() homeRoute = '/inicio';
  @Input() collapsed = false;
  @Input() collapseEnabled = false;
  @Output() readonly toggleRequested = new EventEmitter<void>();
  @Output() readonly logoutRequested = new EventEmitter<void>();
}
