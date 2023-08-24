import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from '../../shared/custom-date-adapter';
import { FormatarMoedaBrl } from '../../services/formatar-moeda-brl.service';

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
  contrato: number | null = null;
  nome: string = '';
  valorContrato: string = '';
  dataContrato: Date | null = null; // Alterada para o tipo Date

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    public FormatarMoedaBrl: FormatarMoedaBrl
  ) {}

  cadastrarContrato() {
    // Formata a data para o formato "YYYY-MM-DD" antes de enviar para a API
    const formattedDate = this.dataContrato ? this.formatarData(this.dataContrato) : '';
    const valorSemFormatacao = this.valorContrato.replace(/[^\d]/g, '');
    const valorFloat = valorSemFormatacao.slice(0, -2) + '.' + valorSemFormatacao.slice(-2);

    const body = new HttpParams()
      .set('CONTRATO', this.contrato!.toString())
      .set('NOME', this.nome)
      .set('VALOR', valorFloat)
      .set('DATA_DO_CONTRATO', formattedDate);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:8080/api/cadastro.asp', body.toString(), { headers })
      .subscribe(
        (response: any) => {
          this.snackBar.open('Contrato '+ this.contrato +' cadastrado com sucesso', 'Fechar', {
            duration: 10000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
          this.resetForm();
        },
        (error: any) => {
          console.error('Erro ao cadastrar contrato', error);
          // Lógica de tratamento de erro, se necessário
        }
      );
  }

  resetForm(): void {
    this.contrato = null;
    this.nome = '';
    this.valorContrato = '';
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
