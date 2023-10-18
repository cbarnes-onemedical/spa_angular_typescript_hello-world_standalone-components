import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from 'src/app/shared/components/page-layout.component';
import { CodeSnippetComponent } from 'src/app/shared/components/code-snippet.component';
import { MessageService } from '@app/core';
import { ActivatedRoute } from '@angular/router';
import { Scope } from './scope';

@Component({
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, CodeSnippetComponent],
  selector: 'app-scopes',
  templateUrl: './scopes.component.html',
})
export class ScopesComponent {
  sessionTokenPayload: any;
  sessionTokenPayloadJson = '';
  state = '';
  title = 'Scope Selection';
  scopes: Scope[] | undefined;
  
  constructor(public messageService: MessageService, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.state = this.activatedRoute.snapshot.queryParams['state'];
    this.messageService.getScopesResource().subscribe((response) => {
      const { data, error } = response;

      if (data) {
        this.sessionTokenPayload = data;
        this.sessionTokenPayloadJson = JSON.stringify(data, null, 2);
      }

      if (error) {
        this.sessionTokenPayload = null;
        this.sessionTokenPayloadJson = JSON.stringify(error, null, 2);
      }

      const requestedScopes: string[] = this.sessionTokenPayload.requested_scopes;
  
      this.scopes = requestedScopes.map(rs => <Scope>{
        name: rs,
        checked: true
      });
    });
  }

  handleAuthorizeScopes(): void {
    const auth0Url = new URL(this.sessionTokenPayload.continue_uri);
    const scopes = this.scopes!.filter(s => s.checked).map(s => s.name).join(' ');

    auth0Url.searchParams.append("state", this.state);
    auth0Url.searchParams.append("scope", scopes);

    window.location.href = auth0Url.href;
  }
}
