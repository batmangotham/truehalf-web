import { Injectable } from "@angular/core";

@Injectable()
export class JwtService {
  /*
     *Fetech the auth token from localstorage
     */
  getToken(): string {
    return window.localStorage["authToken"];
  }

  getRefreshToken(): string {
    return window.localStorage["refreshToken"];
  }
  /**
   * Save token in localstorage
   * @param token
   * @param refresh
   *
   */
  saveToken(token: string, refresh?: string) {
    window.localStorage["authToken"] = token;
    window.localStorage["refreshToken"] = refresh;
  }

  /**
   *Remove JWT from localstorage
   */
  purgeToken() {
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("refreshToken");
  }
}
