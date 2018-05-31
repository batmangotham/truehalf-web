import { AppError } from "./../errors/app-error";
import { Injectable } from "@angular/core";
import { Http, URLSearchParams, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { environment } from "../../../environments/environment";
import { JwtService } from "./jwt.service";
import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
  UnAuthError
} from "./../errors";
@Injectable()
export class ApiService {
  public url: string;
  constructor(private http: Http, private jwt?: JwtService) {
    this.url = environment.baseUrl;
  }
  /**For GET Method
   *
   * @param path No need of tralling or leading backslashes
   * @param params Object of parameters
   */
  get(path: string = "", params?: object): Observable<any> {
    return this.http
      .get(this.url + path, {
        search: this.setUrlParams(params),
        headers: this.setHeaders()
      })
      .map(response => response.json())
      .catch(this.handleErrors);
  }
  /**For POST Method
   *
   * @param path No need of tralling or leading backslashes
   * @param params Params : Object
   */
  post(path: string = "", params?: object): Observable<any> {
    return this.http
      .post(this.url + path, JSON.stringify(params), {
        headers: this.setHeaders()
      })
      .map(response => response.json())
      .catch(this.handleErrors);
  }
  /**For PUT/UPDATE Method
   *
   * @param path No need of tralling or leading backslashes
   * @param params Params : Object
   */
  update(path: string = "", params?: object): Observable<any> {
    return this.http
      .put(this.url + path, JSON.stringify(params), {
        headers: this.setHeaders()
      })
      .map(response => response.json())
      .catch(this.handleErrors);
  }
  /**For DELETE Method
   *
   * @param path No need of tralling or leading backslashes
   * @param params Params : Object
   */
  delete(path: string = "", params?: object): Observable<any> {
    return this.http
      .delete(this.url + path, { headers: this.setHeaders() })
      .map(response => response.json())
      .catch(this.handleErrors);
  }
  /**
   *  set url search params
   * @param params
   */
  private setUrlParams(params: object): URLSearchParams {
    const urlParams: URLSearchParams = new URLSearchParams();
    if (params) {
      for (const item in params) {
        if (params.hasOwnProperty(item)) {
          urlParams.set(item, params[item]);
        }
      }
    }
    return urlParams;
  }
  /**
   * set http request headers
   */
  private setHeaders(): Headers {
    const headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*"
    };

    if (this.jwt.getToken()) {
      headersConfig["Authorization"] = `Bearer ${this.jwt.getToken()}`;
    }
    return new Headers(headersConfig);
  }
  /**
   * Handler errors globally
   * @param error
   */
  private handleErrors(error: Response) {
    if (error.status === 500) {
      return Observable.throw(new InternalServerError(error.json()));
    }
    if (error.status === 400) {
      return Observable.throw(new BadRequestError(error.json()));
    }
    if (error.status === 404) {
      return Observable.throw(new NotFoundError());
    }
    if (error.status === 403) {
      return Observable.throw(new UnAuthError(error.json()));
    }
    return Observable.throw(new AppError());
  }
}
