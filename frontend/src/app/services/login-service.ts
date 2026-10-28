import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
export interface Credential {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly httpClient = inject(HttpClient);

  login(credential: Credential): Observable<any> {
    return this.httpClient.post('http://localhost:4000/api/auth/login', {
      email: credential.username.trim().toLowerCase(),
      password: credential.password,
    });
  }

  decodeToken(token: string): any {
    return jwtDecode(token);
  }
}
