import { Component } from '@angular/core';
import { Event, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import * as LucideIcons  from '@ng-icons/lucide';
import * as tablerIcons from '@ng-icons/tabler-icons';
import * as tablerIconsFill from '@ng-icons/tabler-icons/fill';
import {  provideIcons } from '@ng-icons/core';
import { TitleService } from './common/application/services/title.service';
import { ToastContainer } from './common/components/toast-container/toast-container';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
   providers: [provideIcons({...LucideIcons,...tablerIcons, ...tablerIconsFill})],
})

export class App {
  constructor(
    private router: Router,
    private titleService: TitleService,
  ) {
  }

  ngOnInit() {
    this.titleService.init();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => window.HSStaticMethods.autoInit(), 100);
      }
    });
  }
}
