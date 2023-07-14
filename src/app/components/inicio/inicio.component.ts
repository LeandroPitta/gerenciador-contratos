import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  totalContratos: number = 0;
  mediaContratos: number = 0;
  valorTotal: number = 0;
  
  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    this.fetchData();
  }
  
  fetchData() {
    this.http.get<any>('http://localhost:8080/inicio.asp').subscribe(data => {
      this.totalContratos = data.totalContratos;
      this.mediaContratos = Number(data.mediaContratos.replace(',', '.'));
      this.valorTotal = Number(data.valorTotal.replace(',', '.'));
    });
  }  
}