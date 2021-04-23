export class ResponseObject {
    message: string;
    status: number;
    error: string;
    data: any;
  
    constructor(status: number, message: string = null, data: any, error: string = null) {
      this.status = status
      this.message = message
      this.error = error
      this.data = data
    }
  }