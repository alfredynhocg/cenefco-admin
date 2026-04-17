import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { PageTitle } from '../../../common/components/page-title/page-title';
import { IndicadorGestionService } from '../../application/services/indicador-gestion.service';
import { ToastService } from '../../../common/application/services/toast.service';
import { extractErrorMessage } from '../../../utils/http-error';

@Component({
  selector: 'app-indicador-edit',
  imports: [NgIcon, PageTitle, RouterLink, ReactiveFormsModule],
  templateUrl: './indicador-edit.html',
  styles: ``
})
export class IndicadorEdit implements OnInit {
  private fb               = inject(FormBuilder);
  private indicadorService = inject(IndicadorGestionService);
  private toast            = inject(ToastService);
  private router           = inject(Router);
  private route            = inject(ActivatedRoute);

  submitting   = signal(false);
  loadingData  = signal(true);
  indicadorId  = 0;

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

  ngOnInit(): void {
    this.indicadorId = Number(this.route.snapshot.paramMap.get('id'));
    this.indicadorService.getById(this.indicadorId).subscribe({
      next: (data) => {
        this.form.patchValue({
          ...data,
          periodo:        data.periodo        ?? '',
          fecha_medicion: data.fecha_medicion?.substring(0, 10) ?? '',
        });
        this.loadingData.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo cargar el indicador'));
        this.router.navigate(['/senefco/indicadores-gestion']);
      }
    });
  }

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
    this.indicadorService.update(this.indicadorId, payload).subscribe({
      next: () => {
        this.toast.success('¡Actualizado!', 'Indicador actualizado exitosamente');
        this.router.navigate(['/senefco/indicadores-gestion']);
      },
      error: (err: HttpErrorResponse) => {
        this.toast.error('Error', extractErrorMessage(err, 'No se pudo actualizar el indicador'));
        this.submitting.set(false);
      }
    });
  }
}
