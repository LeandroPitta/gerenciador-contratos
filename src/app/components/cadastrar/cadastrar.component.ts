import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  cadastrarContrato() {
    const formData = new FormData();
    formData.append('CONTRATO', this.contrato.toString());
    formData.append('NOME', this.nome);
    formData.append('VALOR', this.valorContrato.toString());
    formData.append('DATA_DO_CONTRATO', this.dataContrato);

    this.http.post('http://localhost:8080/api/cadastro.asp', formData)
      .subscribe(
        (response: any) => {
          console.log('Contrato cadastrado com sucesso');
          // Lógica adicional após o cadastro, se necessário
        },
        (error: any) => {
          console.error('Erro ao cadastrar contrato', error);
          // Lógica de tratamento de erro, se necessário
        }
      );
  }
}

