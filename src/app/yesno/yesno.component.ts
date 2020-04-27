import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-yesno',
  templateUrl: './yesno.component.html',
  styleUrls: ['./yesno.component.scss']
})
export class YesnoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<YesnoComponent>, @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close();

  }
  onYesClick(){
    this.dialogRef.close(this.data);
  }

}
