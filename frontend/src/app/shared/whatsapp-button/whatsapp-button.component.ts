import { Component, inject, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import { filter } from 'rxjs/operators';

interface MensajeChat {
  emisor: 'bot' | 'usuario';
  texto: string;
}

interface RespuestaChat {
  respuesta: string;
  success?: boolean;
}

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.css'
})
export class WhatsappButtonComponent {
  isOpen = false;
  showButton = true;
  textoUsuario = '';
  cargando = false;

  mensajes: MensajeChat[] = [
    { emisor: 'bot', texto: '¡Hola! 👋 Soy el asistente virtual del CEA. ¿En qué curso estás interesado o qué duda tienes?' }
  ];

  private router = inject(Router);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private readonly chatUrl = 'http://localhost:4000/api/chat';
  private timeoutCarga?: ReturnType<typeof setTimeout>;

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.showButton = !url.includes('/admin') && !url.includes('/login');
      this.isOpen = false; 
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  abrirWhatsApp() {
    const telefono = '573003412175'; 
    const mensaje = 'Hola, necesito información sobre los cursos de conducción.';
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  enviarMensaje() {
    if (this.textoUsuario.trim() === '' || this.cargando) return;

    const mensajeUsuario = this.textoUsuario;
    
    // 1. Mostrar mensaje del usuario en pantalla
    this.mensajes.push({ emisor: 'usuario', texto: mensajeUsuario });
    this.textoUsuario = '';
    this.cargando = true;
    this.scrollToBottom();
    this.cdr.markForCheck();

    // 2. Enviar al backend local
    this.http.post<RespuestaChat>(this.chatUrl, {
      mensaje: mensajeUsuario
    }).pipe(
      timeout(8000)
    ).subscribe({
      next: (res) => {
        if (this.timeoutCarga) clearTimeout(this.timeoutCarga);
        const respuesta = typeof res?.respuesta === 'string' && res.respuesta.trim()
          ? res.respuesta
          : 'No recibí una respuesta válida. Escríbenos por WhatsApp para atenderte.';
        this.mensajes.push({ emisor: 'bot', texto: respuesta });
        this.cargando = false;
        this.scrollToBottom();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (this.timeoutCarga) clearTimeout(this.timeoutCarga);
        console.error('Error al comunicarse con el chat:', err);
        this.mensajes.push({ emisor: 'bot', texto: 'Lo siento, en este momento no puedo responder. Por favor contáctanos por WhatsApp.' });
        this.cargando = false;
        this.scrollToBottom();
        this.cdr.detectChanges();
      }
    });

    this.timeoutCarga = setTimeout(() => {
      if (!this.cargando) return;
      this.cargando = false;
      this.mensajes.push({
        emisor: 'bot',
        texto: 'La respuesta tardó demasiado. Por favor intenta de nuevo o contáctanos por WhatsApp.'
      });
      this.scrollToBottom();
      this.cdr.detectChanges();
    }, 9000);
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBody = document.getElementById('chatBody');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 50);
  }
}