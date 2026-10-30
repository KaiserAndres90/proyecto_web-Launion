import { Component, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // 👈 Importante
import { filter } from 'rxjs/operators';

interface MensajeChat {
  emisor: 'bot' | 'usuario';
  texto: string;
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
  cargando = false; // Para mostrar que la IA está pensando

  mensajes: MensajeChat[] = [
    { emisor: 'bot', texto: '¡Hola! 👋 Soy el asistente virtual del CEA. ¿En qué curso estás interesado o qué duda tienes?' }
  ];

  private router = inject(Router);
  private http = inject(HttpClient); // 👈 Inyectamos HttpClient

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

    // 2. Enviar al backend (Node.js + Gemini)
    this.http.post<any>('http://localhost:4000/api/chat', { 
      mensaje: mensajeUsuario, 
      historial: this.mensajes.slice(0, -1) // Enviamos el historial previo para que la IA tenga contexto
    }).subscribe({
      next: (res) => {
        this.mensajes.push({ emisor: 'bot', texto: res.respuesta });
        this.cargando = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Error con la IA:', err);
        this.mensajes.push({ emisor: 'bot', texto: 'Lo siento, en este momento no puedo responder. Por favor contáctanos por WhatsApp.' });
        this.cargando = false;
        this.scrollToBottom();
      }
    });
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