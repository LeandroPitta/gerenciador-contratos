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
  valorContrato: string = '';
  dataContrato: string = '';
  contratoEncontrado: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.contratoEncontrado = history.state.contratoEncontrado;
    if (this.contratoEncontrado) {
      this.contrato = this.contratoEncontrado.CONTRATO;
      this.nome = this.contratoEncontrado.NOME;
      this.valorContrato = this.formatarParaValorMonetario(this.contratoEncontrado.VALOR);
      this.dataContrato = this.contratoEncontrado.DATA_DO_CONTRATO;
    }
  }

  atualizarContrato() {
    const valorSemFormatacao = this.valorContrato.replace(/[^\d]/g, '');
    const valorFloat = parseFloat(valorSemFormatacao.slice(0, -2) + '.' + valorSemFormatacao.slice(-2));

    const body = new HttpParams()
      .set('CONTRATO', this.contrato.toString())
      .set('NOME', this.nome)
      .set('VALOR', valorFloat.toString())
      .set('DATA_DO_CONTRATO', this.dataContrato);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    this.http.post('http://localhost:8080/api/manutencao.asp', body.toString(), { headers }).subscribe(
      (response: any) => {
        this.snackBar.open('Contrato '+ this.contrato +' atualizado com sucesso', 'Fechar', {
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

  formatarValor(input: HTMLInputElement): void {
    const valor = input.value.replace(/\D/g, "");
    const valorFormatado = (Number(valor) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    input.value = valorFormatado;
  }
}
