import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BolaoResponse } from 'src/app/home/models/responses/bolao.response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-convidar-bolao-modal',
  templateUrl: './convidar-bolao-modal.component.html',
  styleUrls: ['./convidar-bolao-modal.component.css']
})
export class ConvidarBolaoModalComponent implements OnInit {
  @Input() bolao?: BolaoResponse;
  @Output() fecharModal = new EventEmitter<void>();

  isLoading = false;
  conviteUrl = '';

  constructor(
    private toastr: ToastrService,
    // private clipboard: Clipboard
  ) { }

  ngOnInit(): void {
    this.initializeConviteUrl();
  }

  private initializeConviteUrl(): void {
    if (this.bolao?.tokenAcesso) {
      // Create invitation URL with the token
      const baseUrl = window.location.origin;
      this.conviteUrl = `${baseUrl}/convidados`;
    }
  }

  fechar(): void {
    this.fecharModal.emit();
  }

  copiarMensagemConvite(): void {
    let mensagem = `🏆 *Convite para Bolão* 🏆\n\n`;
    mensagem += `Olá! Você foi convidado para participar do bolão *${this.bolao?.nome || 'Copa do Mundo 2024'}*!\n\n`;
    mensagem += `📋 *Como participar:*\n`;
    mensagem += `1. Acesse: ${this.conviteUrl}\n`;
    mensagem += `2. Use o token: *${this.bolao?.tokenAcesso || 'ABC123XYZ'}*\n\n`;
    mensagem += `Venha registrar seus palpites e competir com a gente! 🎮🎯`;
    
    this.copiarParaAreaDeTransferencia(mensagem);
    this.toastr.success('Mensagem de convite copiada para área de transferência!');
  }

  copiarToken() {
    if (this.bolao?.tokenAcesso) {
      this.copiarParaAreaDeTransferencia(this.bolao.tokenAcesso);
      this.toastr.success('Token copiado para área de transferência!');
    }
  }

  private copiarParaAreaDeTransferencia(texto: string): void {
    // Create a temporary textarea element to copy from
    const textArea = document.createElement('textarea');
    textArea.value = texto;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // Select and copy the text
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        console.error('Failed to copy text');
      }
    } catch (err) {
      console.error('Error copying text: ', err);
    }
    
    // Cleanup
    document.body.removeChild(textArea);
  }
}
