import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { EjePeiService } from '../../application/services/eje-pei.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-eje-pei-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './eje-pei-edit.html',
  styles: ``
})
export class EjePeiEdit implements OnInit {
  private fb            = inject(FormBuilder);
  private ejePeiService = inject(EjePeiService);
  private toast         = inject(ToastService);
  private router        = inject(Router);
  private route         = inject(ActivatedRoute);
  private http          = inject(HttpClient);

  submitting   = signal(false);
  isLoading    = signal(true);
  uploadingImg = signal(false);
  imgPreview   = signal<string | null>(null);
  ejeId        = signal<number>(0);

  form: FormGroup = this.fb.group({
    nombre:      ['', [Validators.required, Validators.maxLength(200)]],
    descripcion: [''],
    color:       ['#3b82f6'],
    imagen_url:  [''],
    orden:       [0],
    activo:      [true],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ejeId.set(id);

    this.ejePeiService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        if (data.imagen_url) this.imgPreview.set(data.imagen_url);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el eje PEI'));
        this.isLoading.set(false);
      }
    });
  }

  onImgSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => this.imgPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);

    this.uploadingImg.set(true);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('/api/v1/upload/image', formData).subscribe({
      next: (res) => {
        this.form.patchValue({ imagen_url: res.url });
        this.uploadingImg.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo subir la imagen'));
        this.uploadingImg.set(false);
        input.value = '';
      }
    });
  }

  removeImg(): void {
    this.imgPreview.set(null);
    this.form.patchValue({ imagen_url: '' });
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    if (this.uploadingImg()) return;
    this.submitting.set(true);
    this.ejePeiService.update(this.ejeId(), this.form.value).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Eje PEI actualizado exitosamente');
        this.router.navigate(['/senefco/ejes-pei']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el eje PEI'));
        this.submitting.set(false);
      }
    });
  }
}
