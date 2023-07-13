import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-analitico',
  templateUrl: './analitico.component.html',
  styleUrls: ['./analitico.component.css']
})
export class AnaliticoComponent {
  displayedColumns: string[] = ['Contrato', 'Nome', 'Valor', 'Data do Contrato'];
  dataSource: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl = 'http://localhost:3000/api/tabela';
    this.http.get<any[]>(apiUrl).subscribe(data => {
      this.dataSource = data;
    });
  }
}
