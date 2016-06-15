import {Injectable} from "@angular/core";

@Injectable()
export class WebSocketService {

  ws: WebSocket;
  private callback;

  connect(url: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.ws = this.getWebSocket(url);
  };

  subscribe(callback): void {
    this.callback = callback;
  };

  private getWebSocket(url: string): WebSocket {
    var websocket: WebSocket = new WebSocket(url);

    websocket.onopen = () => {
      console.debug('WEBSOCKET - CONNECTED');
    };

    websocket.onerror = () => {
      console.debug("WEBSOCKET - FAILED TO OPEN A CONNECTION");
    };

    websocket.onclose = () => {
      console.debug("WEBSOCKET - DISCONNECTED");
    };

    websocket.onmessage = (message) => {
      this.callback(message.data);
    };

    return websocket;
  }
}
