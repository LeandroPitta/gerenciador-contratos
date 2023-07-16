import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analitico',
  templateUrl: './analitico.component.html',
  styleUrls: ['./analitico.component.css']
})
export class AnaliticoComponent {
  isLoading = true;
  displayedColumns: string[] = ['CONTRATO', 'NOME', 'VALOR', 'DATA_DO_CONTRATO'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl = 'http://localhost:8080/api/tabela.asp';
    this.http.get<any[]>(apiUrl).subscribe(data => {
      this.dataSource = data;
      this.isLoading = false;
    });
  }  
}