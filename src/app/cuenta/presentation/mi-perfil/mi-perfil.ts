import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, AuthUser } from '../../../auth/application/services/auth.service';
import { PageTitle } from '../../../common/components/page-title/page-title';

@Component({
  selector: 'app-mi-perfil',
  imports: [FormsModule, NgIcon, PageTitle],
  templateUrl: './mi-perfil.html',
  styles: ``
})
export class MiPerfil {
  private http = inject(HttpClient);
  auth         = inject(AuthService);

  // Datos generales
  name  = this.auth.currentUser()?.name ?? '';
  email = this.auth.currentUser()?.email ?? '';

  // Cambio de contraseña
  currentPassword    = '';
  newPassword        = '';
  newPasswordConfirm = '';
  showPasswords      = signal(false);

  // Estados
  savingDatos    = signal(false);
  savingPassword = signal(false);
  successDatos   = signal('');
  successPass    = signal('');
  errorDatos     = signal('');
  errorPass      = signal('');

  get iniciales(): string {
    return (this.auth.currentUser()?.name ?? 'U')
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  guardarDatos(): void {
    if (!this.name.trim()) { this.errorDatos.set('El nombre es requerido.'); return; }
    this.savingDatos.set(true);
    this.successDatos.set('');
    this.errorDatos.set('');

    this.http.put<AuthUser>('/api/auth/perfil', { name: this.name.trim() }).subscribe({
      next: user => {
        this.auth.currentUser.set(user);
        this.savingDatos.set(false);
        this.successDatos.set('Datos actualizados correctamente.');
        setTimeout(() => this.successDatos.set(''), 3000);
      },
      error: err => {
        this.savingDatos.set(false);
        this.errorDatos.set(err?.error?.message ?? 'Error al actualizar los datos.');
      },
    });
  }

  guardarPassword(): void {
    if (!this.currentPassword) { this.errorPass.set('Ingresa tu contraseña actual.'); return; }
    if (!this.newPassword)     { this.errorPass.set('Ingresa la nueva contraseña.'); return; }
    if (this.newPassword.length < 8) { this.errorPass.set('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (this.newPassword !== this.newPasswordConfirm) { this.errorPass.set('Las contraseñas no coinciden.'); return; }

    this.savingPassword.set(true);
    this.successPass.set('');
    this.errorPass.set('');

    this.http.put<AuthUser>('/api/auth/perfil', {
      current_password:      this.currentPassword,
      password:              this.newPassword,
      password_confirmation: this.newPasswordConfirm,
    }).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.successPass.set('Contraseña actualizada correctamente.');
        this.currentPassword = '';
        this.newPassword = '';
        this.newPasswordConfirm = '';
        setTimeout(() => this.successPass.set(''), 3000);
      },
      error: err => {
        this.savingPassword.set(false);
        this.errorPass.set(err?.error?.error ?? err?.error?.message ?? 'Error al cambiar la contraseña.');
      },
    });
  }
}
