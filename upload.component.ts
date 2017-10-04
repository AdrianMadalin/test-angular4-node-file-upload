import {Component, OnInit, ViewChild} from '@angular/core';
import {Http, Response} from "@angular/http";
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

    /* When we select file */
    name: string;
    myFile: File;

    /* property of File type */
    fileChange(files: any) {
        console.log(files);
        this.myFile = files[0];
    }

    constructor(private _http: Http) {}

    ngOnInit() {
    };

    nSubmit(): void {
        const formData = new FormData();
        formData.append("MyFile", this.myFile);

        const body = {
            name: this.name,
            imageData: formData
        };

        this._http.post("http://localhost:8080/users/upload", body)
            .map((response: Response) => <string>response.json())
            .subscribe((data) => console.log(data));
    };

};