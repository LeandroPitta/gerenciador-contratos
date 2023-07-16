import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent {
  contrato: number = 0;
  nome: string = '';
  valorContrato: number = 0;
  dataContrato: string = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  cadastrarContrato() {
    const body = new HttpParams()
      .set('CONTRATO', this.contrato.toString())
      .set('NOME', this.nome)
      .set('VALOR', this.valorContrato.toString())
      .set('DATA_DO_CONTRATO', this.dataContrato);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:8080/api/cadastro.asp', body.toString(), { headers })
      .subscribe(
        (response: any) => {
          this.resetForm();
          this.snackBar.open('Contrato cadastrado com sucesso', 'Fechar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        },
        (error: any) => {
          console.error('Erro ao cadastrar contrato', error);
          // Lógica de tratamento de erro, se necessário
        }
      );
  }

  resetForm(): void {
    this.contrato = 0;
    this.nome = '';
    this.valorContrato = 0;
    this.dataContrato = '';
  }
}
