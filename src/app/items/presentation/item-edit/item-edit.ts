import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ItemService } from '../../application/services/item.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-item-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './item-edit.html',
  styles: ``
})
export class ItemEdit implements OnInit {
  private fb          = inject(FormBuilder);
  private itemService = inject(ItemService);
  private toast       = inject(ToastService);
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);
  private http        = inject(HttpClient);

  submitting      = signal(false);
  loadingData     = signal(true);
  uploadingImagen = signal(false);
  itemId          = 0;

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

  ngOnInit(): void {
    this.itemId = Number(this.route.snapshot.paramMap.get('id'));
    this.itemService.getById(this.itemId).subscribe({
      next: (data) => {
        this.form.patchValue({
          ...data,
          enlace_url: data.enlace_url ?? '',
        });
        this.loadingData.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el ítem'));
        this.router.navigate(['/senefco/items']);
      }
    });
  }

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
    this.itemService.update(this.itemId, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Ítem actualizado exitosamente');
        this.router.navigate(['/senefco/items']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el ítem'));
        this.submitting.set(false);
      }
    });
  }
}
