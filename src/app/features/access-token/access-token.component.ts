import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from 'src/app/shared/components/page-layout.component';
import { CodeSnippetComponent } from 'src/app/shared/components/code-snippet.component';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Component({
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, CodeSnippetComponent],
  selector: 'app-access-token',
  templateUrl: './access-token.component.html',
})
export class AccessTokenComponent implements OnInit {
  title = 'Access Token';

  accessToken$: Observable<string> | undefined;
  
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getAccessToken(false);
  }

  getAccessToken(forceRefresh: boolean): void {
    const cacheMode = forceRefresh ? 'off' : 'on';

    this.accessToken$ = this.authService.getAccessTokenSilently({
      cacheMode: cacheMode
    });
  }

  getDecodedAccessToken(token: string): any {
    try {
      return JSON.stringify(jwt_decode(token), null, 2);
    } catch(Error) {
      return null;
    }
  }
}
