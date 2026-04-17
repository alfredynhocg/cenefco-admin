import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../../../auth/application/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIcon, RouterLink],
  templateUrl: './login.html',
  styles: `
    @keyframes float-bg {
      0%   { transform: translate(0, 0) scale(1); }
      25%  { transform: translate(-12px, -8px) scale(1.03); }
      50%  { transform: translate(8px, -15px) scale(1); }
      75%  { transform: translate(-6px, 8px) scale(0.97); }
      100% { transform: translate(0, 0) scale(1); }
    }
    .animate-float-bg {
      animation: float-bg 20s ease-in-out infinite;
      transform-origin: center;
    }

    @property --snake-angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
    @keyframes snake-border {
      to { --snake-angle: 360deg; }
    }
    .snake-card {
      position: relative;
      border-radius: 12px;
    }
    .snake-card::before {
      content: '';
      position: absolute;
      inset: -1.5px;
      border-radius: 14px;
      background: conic-gradient(
        from var(--snake-angle),
        transparent 80%,
        var(--color-brand-accent) 90%,
        var(--color-brand-accent-light) 93%,
        var(--color-brand-accent) 96%,
        transparent
      );
      animation: snake-border 6s linear infinite;
      z-index: 0;
      opacity: 0.5;
    }
    .snake-card::after {
      content: '';
      position: absolute;
      inset: 1.5px;
      border-radius: 11px;
      background: var(--color-brand-primary-dark);
      z-index: 1;
    }
    .snake-card > * {
      position: relative;
      z-index: 2;
    }
    .snake-card:nth-child(2)::before { animation-delay: -2s; }
    .snake-card:nth-child(3)::before { animation-delay: -4s; }

    .bg-slide {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 1.5s ease-in-out;
      transform: scale(1.08);
    }
    .bg-slide.active {
      opacity: 1;
      animation: ken-burns 6s ease-out forwards;
    }
    @keyframes ken-burns {
      from { transform: scale(1.08); }
      to   { transform: scale(1); }
    }

    .login-glass {
      background: rgba(255, 255, 255, 0.35);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.35);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
    }
    .login-glass .form-input {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.25);
      color: white;
    }
    .login-glass .form-input::placeholder { color: rgba(255,255,255,0.5); }
    .login-glass .form-input:focus {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      outline: none;
    }

    .slide-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transition: all 0.4s ease;
      cursor: pointer;
      border: none;
      padding: 0;
    }
    .slide-dot.active {
      background: white;
      width: 24px;
      border-radius: 4px;
    }
  `
})
export class Login implements OnInit, OnDestroy {
  private auth   = inject(AuthService);
  private router = inject(Router);

  email    = '';
  password = '';
  loading      = signal(false);
  error        = signal('');
  showPassword = signal(false);

  readonly fondos = [
    'assets/images/fondos/9.jpg',
    'assets/images/fondos/10.jpg',
    'assets/images/fondos/11.jpg',
    'assets/images/fondos/12.jpg',
    'assets/images/fondos/13.jpg',
    'assets/images/fondos/33.jpg',
    'assets/images/fondos/36.jpg',
    'assets/images/fondos/50.jpg',
    'assets/images/fondos/53.jpg',
    'assets/images/fondos/54.jpg',
    'assets/images/fondos/55.jpg',
  ];
  currentFondo = signal(0);
  private interval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.currentFondo.update(i => (i + 1) % this.fondos.length);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.interval) clearInterval(this.interval);
  }

  goToFondo(index: number): void {
    this.currentFondo.set(index);
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.currentFondo.update(i => (i + 1) % this.fondos.length);
    }, 5000);
  }

  submit(): void {
    if (!this.email || !this.password) {
      this.error.set('Ingresa tu email y contraseña.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboards/senefco']),
      error: (err) => {
        this.loading.set(false);
        const msg = err?.error?.message ?? err?.error?.error ?? 'Credenciales incorrectas.';
        this.error.set(msg);
      },
    });
  }
}
