import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class InstructionService {
	private instructionUrl = 'http://localhost:5000/upload';

	constructor(private http: Http){}

	save(data: string): Promise<any> {
		return this.post(data);
	}

	private post(data: string): Promise<any> {
		let headers = new Headers({
				'Content-Type': 'text/plain'
		});

		return this.http
			.post(this.instructionUrl, data, { headers: headers })
			.toPromise()
			.then(res => res.json().data)
			.catch(InstructionService.handleError);
	}

	private static handleError(error: any): Promise<any> {
		console.error('An error occurred', error);
		return Promise.reject(error.message || error);
	}
}
