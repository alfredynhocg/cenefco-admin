import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from "@ng-icons/core";

@Component({
  selector: 'app-page-title',
  imports: [RouterLink, NgIcon],
  templateUrl: './page-title.html',
  styles: ``
})
export class PageTitle {
   @Input() title: string = 'Welcome!';
    @Input() subtitle: string | null = null;
}
