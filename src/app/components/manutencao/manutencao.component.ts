import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormatarMoedaBrl } from '../../services/formatar-moeda-brl.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from '../../shared/custom-date-adapter';
import { ValidacaoService } from '../../services/validacao.service';

@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.component.html',
  styleUrls: ['./manutencao.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
  ],
})

export class ManutencaoComponent implements OnInit {

  contrato: number = 0;
  nome: string = '';
  valorContrato: string = '';
  dataContrato: Date | null = null;
  contratoEncontrado: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public FormatarMoedaBrl: FormatarMoedaBrl,
    private validacaoService: ValidacaoService
  ) { }

  ngOnInit() {
    this.contratoEncontrado = history.state.contratoEncontrado;
    if (this.contratoEncontrado) {
      this.contrato = this.contratoEncontrado.CONTRATO;
      this.nome = this.contratoEncontrado.NOME;
      this.valorContrato = this.formatarParaValorMonetario(this.contratoEncontrado.VALOR);
      this.dataContrato = new Date(this.contratoEncontrado.DATA_DO_CONTRATO);
      this.dataContrato.setMinutes(this.dataContrato.getMinutes() + this.dataContrato.getTimezoneOffset());
    }
  }

  atualizarContrato() {
    // Verificar se os dados são válidos
    if (!this.validacaoService.validarDados(
      this.contrato,
      this.nome,
      this.valorContrato,
      this.dataContrato
    )) {
      this.snackBar.open('Dados inválidos. Verifique os campos obrigatórios.', 'Fechar', {
        duration: 5000
      });
      return; // Se os dados não forem válidos, exibir mensagem de erro e sair do método
    }
    const valorSemFormatacao = this.valorContrato.replace(/[^\d]/g, '');
    const valorFloat = valorSemFormatacao.slice(0, -2) + '.' + valorSemFormatacao.slice(-2);
    const formattedDate = this.dataContrato ? this.formatarData(this.dataContrato) : '';

    const body = new HttpParams()
      .set('CONTRATO', this.contrato.toString())
      .set('NOME', this.nome)
      .set('VALOR', valorFloat)
      .set('DATA_DO_CONTRATO', formattedDate);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:8080/api/manutencao.asp', body.toString(), { headers }).subscribe(
      (response: any) => {
        this.snackBar.open('Contrato ' + this.contrato + ' atualizado com sucesso', 'Fechar', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.router.navigate(['/pesquisar']);
      },
      (error: any) => {
        console.error('Erro ao atualizar contrato', error);
        // Lógica de tratamento de erro, se necessário
      }
    );
  }

  formatarParaValorMonetario(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

  voltar() {
    this.router.navigate(['/pesquisar']);
  }
}
