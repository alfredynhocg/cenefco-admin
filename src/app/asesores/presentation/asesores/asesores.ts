import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NgIcon } from '@ng-icons/core';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { AsesorService } from '../../application/services/asesor.service';
import { AsesorListResponse, Asesor } from '../../domain/models/asesor.model';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { Pagination } from '../../../common/components/pagination/pagination';
import { ToastService } from '../../../common/application/services/toast.service';
import Swal from 'sweetalert2';

type ApiState = { type: 'loading' } | { type: 'success'; response: AsesorListResponse } | { type: 'error' };
const LOADING: ApiState = { type: 'loading' };
const ERROR: ApiState   = { type: 'error' };

@Component({
  selector: 'app-asesores',
  standalone: true,
  imports: [NgIcon, PageTitle, Pagination],
  templateUrl: './asesores.html',
})
export class Asesores {
  private service = inject(AsesorService);
  private toast   = inject(ToastService);

  searchQuery    = signal('');
  pageIndex      = signal(1);
  pageSize       = signal(15);
  showForm       = signal(false);
  editingAsesor  = signal<Asesor | null>(null);
  saving         = signal(false);
  private refreshTrigger = signal(0);

  formData = signal({
    nombre: '', telefono: '', email: '', especialidad: '', disponible: true, activo: true
  });

  private params = computed(() => ({
    query:     this.searchQuery(),
    pageIndex: this.pageIndex(),
    pageSize:  this.pageSize(),
    refresh:   this.refreshTrigger(),
  }));

  private state = toSignal(
    toObservable(this.params).pipe(
      switchMap(p =>
        this.service.getAll(p).pipe(
          map(response => ({ type: 'success', response } as ApiState)),
          startWith(LOADING),
          catchError(() => of(ERROR)),
        )
      ),
      startWith(LOADING),
    ),
    { requireSync: true }
  );

  loading  = computed(() => this.state().type === 'loading');
  error    = computed(() => this.state().type === 'error');
  asesores = computed(() => this.state().type === 'success' ? (this.state() as any).response.data : []);
  total    = computed(() => this.state().type === 'success' ? (this.state() as any).response.total : 0);

  onSearch(value: string) { this.searchQuery.set(value); this.pageIndex.set(1); }
  onPageChange(page: number) { this.pageIndex.set(page); }

  openCreate() {
    this.editingAsesor.set(null);
    this.formData.set({ nombre: '', telefono: '', email: '', especialidad: '', disponible: true, activo: true });
    this.showForm.set(true);
  }

  openEdit(a: Asesor) {
    this.editingAsesor.set(a);
    this.formData.set({ nombre: a.nombre, telefono: a.telefono, email: a.email ?? '', especialidad: a.especialidad ?? '', disponible: a.disponible, activo: a.activo });
    this.showForm.set(true);
  }

  closeForm() { this.showForm.set(false); }

  updateField(field: string, value: any) {
    this.formData.update(d => ({ ...d, [field]: value }));
  }

  save() {
    const data = this.formData();
    if (!data.nombre || !data.telefono) {
      this.toast.error('Campos requeridos', 'Nombre y teléfono son obligatorios.');
      return;
    }
    this.saving.set(true);
    const editing = this.editingAsesor();
    const obs = editing ? this.service.update(editing.id, data) : this.service.create(data);
    obs.subscribe({
      next: () => {
        this.toast.success('Guardado', editing ? 'Asesor actualizado.' : 'Asesor creado.');
        this.saving.set(false);
        this.showForm.set(false);
        this.refreshTrigger.update(v => v + 1);
      },
      error: () => {
        this.toast.error('Error', 'No se pudo guardar el asesor.');
        this.saving.set(false);
      }
    });
  }

  toggleDisponible(a: Asesor) {
    this.service.update(a.id, { disponible: !a.disponible }).subscribe({
      next: () => this.refreshTrigger.update(v => v + 1),
      error: () => this.toast.error('Error', 'No se pudo actualizar.')
    });
  }

  confirmDelete(a: Asesor) {
    Swal.fire({
      title: '¿Eliminar asesor?',
      text: `Se eliminará a ${a.nombre} permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
    }).then(result => {
      if (!result.isConfirmed) return;
      this.service.delete(a.id).subscribe({
        next: () => {
          this.toast.success('Eliminado', `${a.nombre} fue eliminado.`);
          this.refreshTrigger.update(v => v + 1);
        },
        error: () => this.toast.error('Error', 'No se pudo eliminar.')
      });
    });
  }
}
