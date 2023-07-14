import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.css']
})
export class CadastrarComponent {
  contrato: string = '';
  nome: string = '';
  valorContrato: number | null = null;
  data: string = '';
  isSubmitting: boolean = false; // Variável de controle

  constructor(private http: HttpClient) { }

  cadastrar() {
    if (this.isSubmitting) {
      return; // Impedir chamadas duplicadas enquanto o envio estiver em andamento
    }

    const apiUrl = 'http://localhost:8080/cadastro.asp';

    let valorContratoDecimal: number | null = null;
    if (this.valorContrato !== null) {
      valorContratoDecimal = parseFloat(this.valorContrato.toFixed(2));
    }

    const contratoData = {
      contrato: this.contrato,
      nome: this.nome,
      valorContrato: valorContratoDecimal,
      data: this.data
    };

    this.isSubmitting = true; // Ativar sinalizador de envio

    this.http.post(apiUrl, contratoData).subscribe(
      response => {
        // Lógica de manipulação de resposta após o cadastro ser realizado
        console.log('Contrato cadastrado com sucesso:', response);
        this.isSubmitting = false; // Desativar sinalizador de envio após a conclusão
      },
      error => {
        // Lógica de tratamento de erro
        console.error('Erro ao cadastrar contrato:', error);
        this.isSubmitting = false; // Desativar sinalizador de envio em caso de erro
      }
    );
  }

  cancelar() {
    // Lógica para cancelar o cadastro (limpar os campos, redirecionar, etc.)
    this.contrato = '';
    this.nome = '';
    this.valorContrato = null;
    this.data = '';
  }
}
