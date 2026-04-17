import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from "@ng-icons/core";
import { SimplebarAngularModule } from "simplebar-angular";
import { NotificacionService } from '../../../../../common/application/services/notificacion.service';

@Component({
  selector: 'app-notification-dropdown',
  imports: [NgIcon, RouterLink, SimplebarAngularModule],
  templateUrl: './notification-dropdown.html',
  styles: ``
})
export class NotificationDropdown {
  readonly notifService = inject(NotificacionService);

  onOpen(): void {
    this.notifService.markAllRead();
  }
}
