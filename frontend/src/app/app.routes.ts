import { Routes } from '@angular/router';
import { adminGuard, authGuard, auxiliarGuard } from './guards/auth.guard';
import { AuxiliarDashboardComponent } from './features/auxiliar/auxiliar-dashboard.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { DashboardHomeComponent } from './features/admin/dashboard-home/dashboard-home.component';
import { CursosComponent } from './features/admin/cursos/cursos.component';
import { LoginComponent } from './features/admin/login/login.component';
import { Recover } from './features/admin/recover/recover.component';
import { ReportesComponent } from './features/admin/reportes/reportes.component';
import { SolicitudesComponent } from './features/admin/solicitudes/solicitudes.component';
import { ContactoComponent } from './features/public/contacto/contacto.component';
import { HorariosComponent } from './features/public/horarios/horarios.component';
import { InicioComponent } from './features/public/inicio/inicio.component';
import { ServiciosComponent } from './features/public/servicios/servicios.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'horarios', component: HorariosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/recover', component: Recover },
  { path: 'auxiliar', redirectTo: 'auxiliar/inicio', pathMatch: 'full' },
  {
    path: 'auxiliar/inicio',
    component: AuxiliarDashboardComponent,
    canActivate: [auxiliarGuard],
  },
  {
    path: 'admin',
    component: DashboardComponent,
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', component: DashboardHomeComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'cursos', component: CursosComponent },
      { path: 'reportes', component: ReportesComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
