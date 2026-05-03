import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import type { IApiResponse } from '../models/api-response.model';
import type { IDbHealthResponse } from '../../features/dashboard/models/db-health.model';

@Injectable({
  providedIn: 'root',
})
export class DbHealthService {
  private readonly http = inject(HttpClient);

  getDbHealth(): Observable<IApiResponse<IDbHealthResponse>> {
    return this.http.get<IApiResponse<IDbHealthResponse>>('/api/db/health');
  }
}
