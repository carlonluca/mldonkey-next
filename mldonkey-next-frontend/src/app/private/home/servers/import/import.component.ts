import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-import',
    imports: [],
    templateUrl: './import.component.html',
    styleUrl: './import.component.scss'
})
export class ImportComponent {
    constructor(
        public dialogRef: MatDialogRef<ImportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { name: string }
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
