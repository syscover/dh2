import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'dh2-confirmation-dialog',
    template: `
        <h1 mat-dialog-title>{{ title }}</h1>
        <div mat-dialog-content>
            <p>{{ question }}</p>
        </div>
        <div mat-dialog-actions>
            <button mat-raised-button class="mat-accent mr-16" [mat-dialog-close]="true" cdkFocusInitial>{{ ok }}</button>
            <button mat-raised-button [mat-dialog-close]="false">{{ cancel}}</button>
        </div>
    `
})
export class ConfirmationDialogComponent implements OnInit
{
    private title: string;
    private question: string;
    private ok: string;
    private cancel: string;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private translateService: TranslateService
    ) 
    {  
    }

    ngOnInit() 
    {
        // load translations for component
        this.translateService.get('CONFIRM').subscribe(response => {
            this.title      = this.data.title ? this.data.title : response['TITLE'];
            this.question   = this.data.question ? this.data.question : response['QUESTION'];
            this.ok         = this.data.ok ? this.data.ok : response['OK'];
            this.cancel     = this.data.cancel ? this.data.cancel : response['CANCEL'];
        });
    }
}
