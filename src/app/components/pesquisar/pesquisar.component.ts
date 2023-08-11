import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styleUrls: ['./pesquisar.component.css']
})
export class PesquisarComponent {
  isLoading = false;
  displayedColumns: string[] = ['CONTRATO', 'NOME', 'VALOR', 'DATA_DO_CONTRATO'];
  dataSource: any[] = [];
  contratoEncontrado: any = null;
  numeroContrato: number | null = null;

  constructor(private http: HttpClient, private router: Router) { }
  

  pesquisarContrato() {
    const apiUrl = 'http://localhost:8080/api/tabela.asp';
    this.isLoading = true;
    this.http.get<any[]>(apiUrl).subscribe(data => {
      this.dataSource = data;
      this.isLoading = false;
      this.contratoEncontrado = this.dataSource.find(c => c.CONTRATO == this.numeroContrato);
      const route = this.router.navigate(['manutencao'], {
        state: {
          contratoEncontrado: this.contratoEncontrado
        },
      });
    });
  }
}
