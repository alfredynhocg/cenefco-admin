import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { IndicadorGestionService } from '../../application/services/indicador-gestion.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-indicador-create',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './indicador-create.html',
  styles: ``
})
export class IndicadorCreate {
  private fb               = inject(FormBuilder);
  private indicadorService = inject(IndicadorGestionService);
  private toast            = inject(ToastService);
  private router           = inject(Router);

  submitting = signal(false);

  categorias = [
    { value: 'social',           label: 'Social'           },
    { value: 'economico',        label: 'Económico'        },
    { value: 'infraestructura',  label: 'Infraestructura'  },
    { value: 'salud',            label: 'Salud'            },
    { value: 'educacion',        label: 'Educación'        },
    { value: 'medioambiente',    label: 'Medio Ambiente'   },
    { value: 'seguridad',        label: 'Seguridad'        },
    { value: 'otro',             label: 'Otro'             },
  ];

  estados = [
    { value: 'en_meta',    label: 'En Meta'    },
    { value: 'por_encima', label: 'Por Encima' },
    { value: 'por_debajo', label: 'Por Debajo' },
    { value: 'sin_dato',   label: 'Sin Dato'   },
  ];

  unidades = ['%', 'Bs', 'N°', 'km', 'm²', 'ha', 'ton', 'personas', 'familias', 'días', 'otro'];

  form: FormGroup = this.fb.group({
    nombre:         ['', [Validators.required, Validators.maxLength(250)]],
    descripcion:    [''],
    categoria:      ['social', [Validators.required]],
    unidad:         ['%', [Validators.required]],
    meta:           [null],
    valor_actual:   [null],
    periodo:        [''],
    fecha_medicion: [''],
    estado:         ['sin_dato', [Validators.required]],
    responsable:    [''],
    publicado:      [false],
    activo:         [true],
  });

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const value = this.form.value;
    const payload = {
      ...value,
      meta:           value.meta           !== '' ? value.meta           : null,
      valor_actual:   value.valor_actual   !== '' ? value.valor_actual   : null,
      periodo:        value.periodo        || null,
      fecha_medicion: value.fecha_medicion || null,
    };

    this.submitting.set(true);
    this.indicadorService.create(payload).subscribe({
      next: () => {
        this.toast.success('¡Registrado!', 'Indicador registrado exitosamente');
        this.router.navigate(['/senefco/indicadores-gestion']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo guardar el indicador'));
        this.submitting.set(false);
      }
    });
  }
}
