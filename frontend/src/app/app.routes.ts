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
import { NotFoundComponent } from './features/not-found/not-found.component';
import { SolicitudComponent } from './features/public/solicitud/solicitud.component';
import { TramitesComponent } from './features/public/tramites/tramites.component';

// 👇 Imports de Sedes (Verifica que estos nombres coincidan con tus archivos reales)
import { Sedes } from './features/public/sedes/sedes';
import { SedeDetalleComponent } from './features/public/sede-detalle/sede-detalle';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', component: InicioComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'horarios', component: HorariosComponent },
  { path: 'tramites', component: TramitesComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'solicitud', component: SolicitudComponent },

  // 👇 Rutas de Sedes
  { path: 'sedes', component: Sedes },
  { path: 'sedes/:id', component: SedeDetalleComponent },

  { path: 'admin/login', component: LoginComponent },
  { path: 'admin/recover', component: Recover },
  { path: 'auxiliar', redirectTo: 'auxiliar/inicio', pathMatch: 'full' },
  {
    path: 'auxiliar/inicio',
    component: AuxiliarDashboardComponent,
    canActivate: [authGuard, auxiliarGuard],
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
  { path: '**', component: NotFoundComponent },
];