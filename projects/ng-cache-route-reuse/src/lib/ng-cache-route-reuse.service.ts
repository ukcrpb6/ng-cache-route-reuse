import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';

import {
  NgCacheRouteReuseStoreService,
  StoreAction,
} from './ng-cache-route-reuse-store.service';

/**
 * Provides access to reuse route's component attach/detach hooks
 * and detached routes store
 */
@Injectable()
export class NgCacheRouteReuseService {
  private static instance: NgCacheRouteReuseService = null;

  constructor(private storeService: NgCacheRouteReuseStoreService) {}

  public static getInstance(): NgCacheRouteReuseService {
    if (!NgCacheRouteReuseService.instance) {
      const storeService = NgCacheRouteReuseStoreService.getInstance();
      const instance = new NgCacheRouteReuseService(storeService);

      NgCacheRouteReuseService.instance = instance;
    }

    return NgCacheRouteReuseService.instance;
  }

  /**
   * `Attach` component lifecycle hook.
   *
   * Triggers on component reattach - re-navigate on reuse route.
   */
  public onAttach(
    component: string | Type<any>
  ): Observable<string | Type<any>> {
    return this.storeService.on(StoreAction.Delete, component);
  }

  /**
   * `Detach` component lifecycle hook.
   *
   * Triggers on component detach - navigate from reuse route.
   */
  public onDetach(
    component: string | Type<any>
  ): Observable<string | Type<any>> {
    return this.storeService.on(StoreAction.Set, component);
  }

  /**
   * Check whether component is attached
   */
  public isAttached(component: string | Type<any>): boolean {
    return !this.storeService.has(component);
  }

  /**
   * Check whether component is detached
   */
  public isDetached(component: string | Type<any>): boolean {
    return this.storeService.has(component);
  }

  /**
   * Delete all detached routes
   */
  public clear(): void {
    this.storeService.clear();
  }
}
