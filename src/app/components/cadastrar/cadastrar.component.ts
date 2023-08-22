import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from '../../shared/custom-date-adapter';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})
export class CadastrarComponent {
  contrato!: number;
  nome!: string;
  valorContrato!: number;
  dataContrato: Date | null = null; // Alterada para o tipo Date

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  cadastrarContrato() {
    // Formata a data para o formato "YYYY-MM-DD" antes de enviar para a API
    const formattedDate = this.dataContrato ? this.formatarData(this.dataContrato) : '';

    const body = new HttpParams()
      .set('CONTRATO', this.contrato.toString())
      .set('NOME', this.nome)
      .set('VALOR', this.valorContrato.toString())
      .set('DATA_DO_CONTRATO', formattedDate);

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
    this.dataContrato = null;
  }

  formatarData(data: Date): string {
    const year = data.getFullYear();
    const month = data.getMonth() + 1;
    const day = data.getDate();
    return `${year}-${this.adicionarZeroEsquerda(month)}-${this.adicionarZeroEsquerda(day)}`;
  }

  adicionarZeroEsquerda(numero: number): string {
    return numero < 10 ? `0${numero}` : numero.toString();
  }
}
