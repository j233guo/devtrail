import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';

import type { IApiResponse } from '../models/api-response.model';
import type { IHealthResponse } from '../../features/dashboard/models/health.model';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private readonly http = inject(HttpClient);

  getHealth(): Observable<IApiResponse<IHealthResponse>> {
    return this.http.get<IApiResponse<IHealthResponse>>('/api/health');
  }
}
