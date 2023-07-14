import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analitico',
  templateUrl: './analitico.component.html',
  styleUrls: ['./analitico.component.css']
})
export class AnaliticoComponent {
  isLoading = true;
  displayedColumns: string[] = ['Contrato', 'Nome', 'Valor', 'Data do Contrato'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl = 'http://localhost:8080/tabela.asp';
    this.http.get<any[]>(apiUrl).subscribe(data => {
      this.dataSource = data;
      this.isLoading = false;
    });
  }
}