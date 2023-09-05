import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomDateAdapter, CUSTOM_DATE_FORMATS } from '../../shared/custom-date-adapter';
import { FormatarMoedaBrl } from '../../services/formatar-moeda-brl.service';
import { ValidacaoService } from '../../services/validacao.service';

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
  maxDate: Date = new Date();

  constructor(
    private http: HttpClient, 
    private snackBar: MatSnackBar,
    public FormatarMoedaBrl: FormatarMoedaBrl,
    private validacaoService: ValidacaoService
  ) {}

  async cadastrarContrato() {
    // Etapa 1: Verificar se os dados são válidos
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
  
    try {
      // Etapa 2: Verificar se o contrato já existe no banco de dados
      const contratoExiste = await this.verificarContratoExistente(this.contrato!);
  
      if (contratoExiste) {
        this.snackBar.open('Contrato já esta cadastrado', 'Fechar', {
          duration: 5000
        });
      } else {
        // Etapa 3: Enviar a solicitação para cadastrar o contrato
        await this.cadastrarContratoNaAPI(body, headers);
      }
    } catch (error) {
      console.error('Erro ao cadastrar contrato', error);
      // Lógica de tratamento de erro, se necessário
    }
  }

  async verificarContratoExistente(contrato: number): Promise<boolean> {
    const apiUrl = `http://localhost:8080/api/tabela.asp`;

    try {
      const data = await this.http.get<any[]>(apiUrl).toPromise();
      const contratoEncontrado = data!.find(c => c.CONTRATO == contrato);
      return !!contratoEncontrado;
    } catch (error) {
      console.error('Erro ao verificar contrato', error);
      throw error; // Propague o erro para que a lógica de tratamento de erro possa lidar com ele
    }
  }

  async cadastrarContratoNaAPI(body: HttpParams, headers: HttpHeaders): Promise<void> {
    const apiUrl = 'http://localhost:8080/api/cadastro.asp';

    try {
      const response = await this.http.post(apiUrl, body.toString(), { headers }).toPromise();
      this.snackBar.open('Contrato ' + this.contrato + ' cadastrado com sucesso', 'Fechar', {
        duration: 10000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar contrato', error);
      // Lógica de tratamento de erro, se necessário
    }
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
