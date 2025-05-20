/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpBackend, HttpEvent, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { FETCH_API } from "@ngx-templates/shared/fetch";
import { Observable, from } from "rxjs";
import { map, switchMap } from "rxjs/operators";


export class FetchMockBackend extends HttpBackend {
  private _fetch = inject(FETCH_API);
  handle(req: HttpRequest<unknown>): Observable<HttpEvent<unknown>> {
    // eslint-disable-next-line no-debugger
    debugger;
    const response = this._fetch(req.urlWithParams, {
      method: req.method,
      headers: req.headers.keys().reduce((headers, key) => {
        headers[key] = req.headers.get(key)!;
        return headers;
      }, {} as Record<string, string>), 
    });
    return from(response).pipe(
      switchMap((response: Response) => {
        if (response.ok) {
          return response
            .json()
            .then((body: unknown) => new HttpResponse({ body, status: response.status }));
        } else {
          return response
            .text()
            .then((text: string) => {
              throw new Error(`HTTP error ${response.status}: ${text}`);
            });
        }
      }
      ),
      map((event: HttpResponse<unknown>) => {
        return event;
      }),
    );
  }
}
