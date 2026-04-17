import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { UsuarioService } from '../../../usuarios/application/services/usuario.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { Rol } from '../../../usuarios/domain/models/usuario.model';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-usuario-edit',
  imports: [ReactiveFormsModule, PageTitle],
  templateUrl: './usuario-edit.html',
  styles: ``
})
export class UsuarioEdit implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(UsuarioService);
  private router  = inject(Router);
  private route   = inject(ActivatedRoute);
  private toast   = inject(ToastService);

  id    = 0;
  roles = signal<Rol[]>([]);

  form: FormGroup = this.fb.group({
    name:     ['', [Validators.required, Validators.maxLength(150)]],
    email:    ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: [''],
    role_id:  [null],
    activo:   [true],
  });

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getRoles().subscribe({ next: roles => this.roles.set(roles) });
    this.service.getById(this.id).subscribe({
      next: u => this.form.patchValue({ name: u.name, email: u.email, role_id: u.role_id, activo: u.activo }),
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se encontró el usuario'));
        this.router.navigate(['/senefco/usuarios']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { password, ...rest } = this.form.value;
    const payload = password ? { ...rest, password } : rest;
    this.service.update(this.id, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'El usuario ha sido actualizado exitosamente');
        this.router.navigate(['/senefco/usuarios']);
      },
      error: () => this.toast.error('Error', 'No se pudo actualizar el usuario')
    });
  }
}
