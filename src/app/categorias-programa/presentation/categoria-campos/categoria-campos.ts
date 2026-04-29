import { Component, Input, OnChanges, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { CategoriaProgramaService } from '../../application/services/categoria-programa.service';
import {
  CategoriaCampo,
  CreateCategoriaCampoPayload,
  TIPOS_CAMPO,
  TipoCampo,
} from '../../domain/models/categoria-programa.model';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria-campos',
  standalone: true,
  imports: [ReactiveFormsModule, NgIcon],
  templateUrl: './categoria-campos.html',
})
export class CategoriaCampos implements OnChanges {
  @Input() categoriaId!: number;

  private service = inject(CategoriaProgramaService);
  private toast   = inject(ToastService);
  private fb      = inject(FormBuilder);

  campos      = signal<CategoriaCampo[]>([]);
  loading     = signal(false);
  saving      = signal(false);
  mostrarForm = signal(false);
  editandoId  = signal<number | null>(null);

  readonly tiposCampo = TIPOS_CAMPO;

  form: FormGroup = this.fb.group({
    nombre_campo: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/^[a-z0-9_]+$/)]],
    etiqueta:     ['', [Validators.required, Validators.maxLength(200)]],
    tipo_campo:   ['text', Validators.required],
    requerido:    [false],
    activo:       [true],
    ayuda:        ['', Validators.maxLength(400)],
    opciones_raw: [''],
  });

  ngOnChanges(): void {
    if (this.categoriaId) {
      this.cargarCampos();
    }
  }

  cargarCampos(): void {
    this.loading.set(true);
    this.service.getCampos(this.categoriaId).subscribe({
      next: (data) => { this.campos.set(data); this.loading.set(false); },
      error: () => { this.toast.error('Error', 'No se pudieron cargar los campos'); this.loading.set(false); },
    });
  }

  abrirNuevo(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre_campo: '', etiqueta: '', tipo_campo: 'text', requerido: false, activo: true, ayuda: '', opciones_raw: '' });
    this.form.get('nombre_campo')!.enable();
    this.mostrarForm.set(true);
  }

  abrirEditar(campo: CategoriaCampo): void {
    this.editandoId.set(campo.id);
    this.form.patchValue({
      nombre_campo: campo.nombre_campo,
      etiqueta:     campo.etiqueta,
      tipo_campo:   campo.tipo_campo,
      requerido:    campo.requerido,
      activo:       campo.activo,
      ayuda:        campo.ayuda ?? '',
      opciones_raw: campo.opciones ? campo.opciones.join('\n') : '',
    });
    this.form.get('nombre_campo')!.disable();
    this.mostrarForm.set(true);
  }

  cancelar(): void {
    this.mostrarForm.set(false);
    this.editandoId.set(null);
  }

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const raw = this.form.getRawValue();
    const payload: CreateCategoriaCampoPayload = {
      nombre_campo: raw.nombre_campo,
      etiqueta:     raw.etiqueta,
      tipo_campo:   raw.tipo_campo as TipoCampo,
      requerido:    raw.requerido,
      activo:       raw.activo,
      ayuda:        raw.ayuda || null,
      opciones:     raw.tipo_campo === 'select'
        ? (raw.opciones_raw as string).split('\n').map((s: string) => s.trim()).filter(Boolean)
        : null,
    };

    this.saving.set(true);
    const id = this.editandoId();

    const op$ = id
      ? this.service.updateCampo(this.categoriaId, id, payload)
      : this.service.createCampo(this.categoriaId, payload);

    op$.subscribe({
      next: () => {
        this.toast.success('¡Guardado!', id ? 'Campo actualizado' : 'Campo creado');
        this.saving.set(false);
        this.cancelar();
        this.cargarCampos();
      },
      error: (err) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el campo'));
        this.saving.set(false);
      },
    });
  }

  eliminar(campo: CategoriaCampo): void {
    Swal.fire({
      title: '¿Eliminar campo?',
      html: `Se eliminará <b>${campo.etiqueta}</b>. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;
      this.service.deleteCampo(this.categoriaId, campo.id).subscribe({
        next: () => { this.toast.success('¡Eliminado!', 'El campo fue eliminado'); this.cargarCampos(); },
        error: () => this.toast.error('Error', 'No se pudo eliminar el campo'),
      });
    });
  }

  moverArriba(index: number): void {
    if (index === 0) return;
    const lista = [...this.campos()];
    [lista[index - 1], lista[index]] = [lista[index], lista[index - 1]];
    this.campos.set(lista);
    this.sincronizarOrden(lista);
  }

  moverAbajo(index: number): void {
    const lista = [...this.campos()];
    if (index === lista.length - 1) return;
    [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
    this.campos.set(lista);
    this.sincronizarOrden(lista);
  }

  private sincronizarOrden(lista: CategoriaCampo[]): void {
    const items = lista.map((c, i) => ({ id: c.id, orden: i }));
    this.service.reorderCampos(this.categoriaId, items).subscribe({
      error: () => this.toast.error('Error', 'No se pudo guardar el orden'),
    });
  }

  get esSelect(): boolean {
    return this.form.get('tipo_campo')?.value === 'select';
  }

  etiquetaTipo(tipo: string): string {
    return this.tiposCampo.find(t => t.value === tipo)?.label ?? tipo;
  }

  iconoTipo(tipo: string): string {
    const map: Record<string, string> = {
      text: 'lucideType', email: 'lucideMail', number: 'lucideHash',
      date: 'lucideCalendar', textarea: 'lucideAlignLeft', select: 'lucideList',
      boolean: 'lucideToggleLeft', file_pdf: 'lucideFileText', file_image: 'lucideImage',
    };
    return map[tipo] ?? 'lucideSquare';
  }
}
