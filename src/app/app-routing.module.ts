import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { PesquisarComponent } from './components/pesquisar/pesquisar.component';
import { AnaliticoComponent } from './components/analitico/analitico.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'cadastrar', component: CadastrarComponent },
  { path: 'pesquisar', component: PesquisarComponent },
  { path: 'analitico', component: AnaliticoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
