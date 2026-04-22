import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { ToastService } from '../../../common/application/services/toast.service';
import { CertificadoService } from '../../application/services/certificado.service';
import { CertCampo, CertPlantilla } from '../../domain/models/certificado.model';
import { extractErrorMessage } from '../../../utils/http-error';
import Swal from 'sweetalert2';

const CAMPO_VACIO = {
  clave: '', etiqueta: '', tipo: 'texto',
  pos_x_pct: 50, pos_y_pct: 50, ancho_pct: null as number | null,
  tamano_pt: 48, color: '#000000', alineacion: 'center',
  negrita: false, cursiva: false, mayusculas: 'upper',
  valor_fijo: '', activo: true, orden: 0,
};

@Component({
  selector: 'app-cert-plantilla-campos',
  imports: [NgIcon, PageTitle, RouterLink],
  templateUrl: './cert-plantilla-campos.html',
  styles: ``
})
export class CertPlantillaCampos implements OnInit {
  private service = inject(CertificadoService);
  private toast   = inject(ToastService);
  private route   = inject(ActivatedRoute);

  plantillaId = signal(0);
  plantilla   = signal<CertPlantilla | null>(null);
  campos      = signal<CertCampo[]>([]);
  loading     = signal(false);

  showForm  = signal(false);
  editando  = signal<CertCampo | null>(null);
  guardando = signal(false);
  form      = signal({ ...CAMPO_VACIO });

  readonly clavesSugeridas = [
    { value: 'nombre_completo', label: 'Nombre completo del estudiante' },
    { value: 'programa',        label: 'Nombre del programa/curso' },
    { value: 'condicion',       label: 'Condición (APROBADO / PARTICIPÓ)' },
    { value: 'nota',            label: 'Nota final' },
    { value: 'fecha_inicio',    label: 'Fecha de inicio' },
    { value: 'fecha_fin',       label: 'Fecha de fin' },
    { value: 'codigo',          label: 'Código de verificación' },
    { value: 'ci',              label: 'Carnet de identidad' },
    { value: 'qr',              label: 'Código QR (imagen)' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.plantillaId.set(id);
    this.cargar();
  }

  cargar(): void {
    const id = this.plantillaId();
    this.loading.set(true);
    this.service.getPlantillaById(id).subscribe({
      next: (p) => { this.plantilla.set(p); this.campos.set(p.campos ?? []); this.loading.set(false); },
      error: () => { this.toast.error('Error', 'No se pudo cargar la plantilla.'); this.loading.set(false); },
    });
  }

  nuevoCampo(): void {
    this.editando.set(null);
    this.form.set({ ...CAMPO_VACIO });
    this.showForm.set(true);
  }

  editarCampo(c: CertCampo): void {
    this.editando.set(c);
    this.form.set({ clave: c.clave, etiqueta: c.etiqueta, tipo: c.tipo,
      pos_x_pct: c.pos_x_pct, pos_y_pct: c.pos_y_pct, ancho_pct: c.ancho_pct,
      tamano_pt: c.tamano_pt, color: c.color, alineacion: c.alineacion,
      negrita: c.negrita, cursiva: c.cursiva, mayusculas: c.mayusculas,
      valor_fijo: c.valor_fijo ?? '', activo: c.activo, orden: c.orden });
    this.showForm.set(true);
  }

  cancelar(): void { this.showForm.set(false); this.editando.set(null); }

  onField(field: string, value: any): void {
    this.form.update(f => ({ ...f, [field]: value }));
    if (field === 'clave' && value === 'qr') {
      this.form.update(f => ({ ...f, tipo: 'imagen' }));
    }
  }

  guardar(): void {
    const f = this.form();
    if (!f.clave) { this.toast.warning('Falta clave', 'Seleccione el campo (clave).'); return; }
    this.guardando.set(true);
    const payload = { ...f, plantilla_id: this.plantillaId() };
    const ed = this.editando();
    const obs = ed ? this.service.updateCampo(ed.id, payload) : this.service.createCampo(payload);
    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success('¡Guardado!', 'Campo guardado correctamente.');
        this.showForm.set(false);
        this.editando.set(null);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        this.toast.error('Error', extractErrorMessage(err));
      },
    });
  }

  deleteCampo(c: CertCampo): void {
    Swal.fire({ title: `¿Eliminar "${c.etiqueta}"?`, icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonText: 'Cancelar', confirmButtonText: 'Sí, eliminar',
    }).then(r => {
      if (!r.isConfirmed) return;
      this.service.deleteCampo(c.id).subscribe({
        next: () => { this.toast.success('Eliminado', 'Campo eliminado.'); this.cargar(); },
        error: (err: HttpErrorResponse) => this.toast.error('Error', extractErrorMessage(err)),
      });
    });
  }
}
