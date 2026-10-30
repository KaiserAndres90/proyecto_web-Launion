import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChatHistoryItem {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

export interface ChatResponse {
  readonly success: boolean;
  readonly message?: string;
  readonly data?: {
    readonly reply: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:4000/api/chat';

  enviarMensaje(message: string, history: readonly ChatHistoryItem[] = []): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.apiUrl, { message, history });
  }
}
