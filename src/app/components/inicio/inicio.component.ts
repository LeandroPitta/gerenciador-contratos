import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Contrato {
  CONTRATO: number;
  NOME: string;
  VALOR: number;
  DATA_DO_CONTRATO: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  totalContratos: number = 0;
  mediaContratos: string = '0';
  valorTotal: string = '0';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<Contrato[]>('http://localhost:8080/api/tabela.asp').subscribe(data => {
      this.totalContratos = data.length;
      const valores = data.map(contrato => contrato.VALOR);
      const valorTotal = valores.reduce((total, valor) => total + valor, 0);
      this.valorTotal = this.formatCurrency(valorTotal);
      this.mediaContratos = this.formatCurrency(valorTotal / this.totalContratos);
    });
  }  

  private formatCurrency(value: number): string {
    return 'R$ ' + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }
}
