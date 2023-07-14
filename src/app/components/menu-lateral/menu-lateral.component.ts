import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit, AfterViewInit {
  @ViewChild('btnInicio', { static: false }) btnInicio!: MatButtonToggle;

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.btnInicio) {
        this.btnInicio._buttonElement.nativeElement.click();
        this.btnInicio.checked = true;
      }
    }, 0);
  }
}
