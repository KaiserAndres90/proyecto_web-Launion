import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');

    if (typeof token === 'string' && token.trim().length > 0) {
      return true;
    }
  }

  void router.navigate(['/admin/login']);
  return false;
};

const obtenerRol = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ rol?: string }>(token);
    return decoded.rol ?? null;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const rol = obtenerRol();

  if (rol === 'admin' || rol === 'gerente') return true;

  void router.navigate(['/admin/login']);
  return false;
};

export const auxiliarGuard: CanActivateFn = () => {
  const router = inject(Router);
  const rol = obtenerRol();
  const rolesAuxiliares = ['aux_atencion', 'aux_teoria', 'aux_practica', 'aux_documentacion'];

  if (rol && rolesAuxiliares.includes(rol)) return true;

  void router.navigate(['/admin/login']);
  return false;
};
