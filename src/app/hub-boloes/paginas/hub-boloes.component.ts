import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

interface Bolao {
  id: number;
  nome: string;
  administrador: string;
  premio: string;
  status: 'disponivel' | 'com-senha' | 'pedir-entrada';
}

@Component({
  selector: 'app-hub-boloes',
  templateUrl: './hub-boloes.component.html',
  styleUrls: ['./hub-boloes.component.css']
})
export class HubBoloesComponent implements OnInit {
  
  termoBusca: string = '';
  boloes: Bolao[] = [
    {
      id: 1,
      nome: 'Bolao dos Cria',
      administrador: 'Thiago Moiss',
      premio: '1000 reais',
      status: 'disponivel'
    },
    {
      id: 2,
      nome: 'Bolao dos Cria',
      administrador: 'Thiago Moiss',
      premio: '1000 reais',
      status: 'com-senha'
    },
    {
      id: 3,
      nome: 'Bolao dos Cria',
      administrador: 'Thiago Moiss',
      premio: '1000 reais',
      status: 'pedir-entrada'
    },
    {
      id: 4,
      nome: 'Bolao dos Cria',
      administrador: 'Thiago Moiss',
      premio: '1000 reais',
      status: 'pedir-entrada'
    }
  ];

  boloesFiltrados: Bolao[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.boloesFiltrados = this.boloes;
  }

  buscarBoloes(): void {
    if (this.termoBusca.trim() === '') {
      this.boloesFiltrados = this.boloes;
    } else {
      this.boloesFiltrados = this.boloes.filter(bolao => 
        bolao.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        bolao.administrador.toLowerCase().includes(this.termoBusca.toLowerCase())
      );
    }
  }

  entrarBolao(bolao: Bolao): void {
    console.log('Entrando no bolão:', bolao.nome);
    // Implementar lógica de entrada no bolão
  }

  entrarComSenha(bolao: Bolao): void {
    console.log('Entrando com senha no bolão:', bolao.nome);
    // Implementar modal ou navegação para entrada com senha
  }

  pedirEntrada(bolao: Bolao): void {
    console.log('Pedindo entrada no bolão:', bolao.nome);
    // Implementar lógica para solicitar entrada
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'disponivel': return '';
      case 'com-senha': return 'Entrar com senha';
      case 'pedir-entrada': return 'Pedir para entrar';
      default: return '';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'com-senha': return '#198754';
      case 'pedir-entrada': return '#2196F3';
      default: return '#198754';
    }
  }

  navegarNovoBolao(): void {
    this.router.navigate(['home/criar-bolao']);
    // Implementar navegação para criação de novo bolão
  }
}