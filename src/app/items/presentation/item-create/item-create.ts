import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ItemService } from '../../application/services/item.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-item-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './item-create.html',
  styles: ``
})
export class ItemCreate {
  private fb          = inject(FormBuilder);
  private itemService = inject(ItemService);
  private toast       = inject(ToastService);
  private router      = inject(Router);
  private http        = inject(HttpClient);

  submitting      = signal(false);
  uploadingImagen = signal(false);

  tipos = [
    { value: 'servicio',  label: 'Servicio'  },
    { value: 'tramite',   label: 'Trámite'   },
    { value: 'producto',  label: 'Producto'  },
    { value: 'recurso',   label: 'Recurso'   },
    { value: 'otro',      label: 'Otro'      },
  ];

  form: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(250)]],
    descripcion: [''],
    tipo:        ['servicio', [Validators.required]],
    precio:      [null],
    imagen_url:  [''],
    enlace_url:  [''],
    orden:       [0],
    publicado:   [false],
    activo:      [true],
  });

  onImagenSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingImagen.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ imagen_url: res.url });
        this.uploadingImagen.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.uploadingImagen.set(false);
        input.value = '';
      }
    });
  }

  removeImagen(): void {
    this.form.patchValue({ imagen_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImagen()) return;

    const value = this.form.value;
    const payload = {
      ...value,
      precio:     value.precio !== '' ? value.precio : null,
      enlace_url: value.enlace_url || null,
    };

    this.submitting.set(true);
    this.itemService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Ítem registrado exitosamente');
        this.router.navigate(['/senefco/items']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el ítem'));
        this.submitting.set(false);
      }
    });
  }
}
