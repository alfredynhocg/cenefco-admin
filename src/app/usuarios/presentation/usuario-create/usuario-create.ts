import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { UsuarioService } from '../../../usuarios/application/services/usuario.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { Rol } from '../../../usuarios/domain/models/usuario.model';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-usuario-create',
  imports: [ReactiveFormsModule, PageTitle],
  templateUrl: './usuario-create.html',
  styles: ``
})
export class UsuarioCreate implements OnInit {
  private fb      = inject(FormBuilder);
  private service = inject(UsuarioService);
  private router  = inject(Router);
  private toast   = inject(ToastService);

  roles = signal<Rol[]>([]);

  form: FormGroup = this.fb.group({
    name:     ['', [Validators.required, Validators.maxLength(150)]],
    email:    ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role_id:  [null],
    activo:   [true],
  });

  ngOnInit(): void {
    this.service.getRoles().subscribe({
      next: roles => this.roles.set(roles),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.service.create(this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Usuario creado!', 'El usuario ha sido registrado exitosamente');
        this.router.navigate(['/senefco/usuarios']);
      },
      error: () => this.toast.error('Error', 'No se pudo crear el usuario. Intente nuevamente.')
    });
  }

  onReset(): void { this.form.reset({ activo: true }); }
}
