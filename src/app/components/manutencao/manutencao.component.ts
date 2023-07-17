import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css']
})
export class ManutencaoComponent implements OnInit {
  contrato: number = 0;
  nome: string = '';
  valorContrato: number = 0;
  dataContrato: string = '';
  contratoEncontrado: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.contratoEncontrado = history.state.contratoEncontrado;
    console.log(this.contratoEncontrado);
    if (this.contratoEncontrado) {
      this.contrato = this.contratoEncontrado.CONTRATO;
      this.nome = this.contratoEncontrado.NOME;
      this.valorContrato = this.contratoEncontrado.VALOR;
      this.dataContrato = this.contratoEncontrado.DATA_DO_CONTRATO;
    }
  }

  atualizarContrato() {
    const body = new HttpParams()
      .set('CONTRATO', this.contrato.toString())
      .set('NOME', this.nome)
      .set('VALOR', this.valorContrato.toString())
      .set('DATA_DO_CONTRATO', this.dataContrato);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:8080/api/manutencao.asp', body.toString(), { headers }).subscribe(
      (response: any) => {
        this.snackBar.open('Contrato atualizado com sucesso', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      (error: any) => {
        console.error('Erro ao atualizar contrato', error);
        // Lógica de tratamento de erro, se necessário
      }
    );
  }

}
