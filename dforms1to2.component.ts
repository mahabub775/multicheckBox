import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DformService } from '../../../services/dform.service';
import { CommonService } from '../../../services/common.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-dforms1to2',
  templateUrl: './dforms1to2.component.html',
  styleUrls: ['./dforms1to2.component.css']
})
export class Dforms1to2Component implements OnInit {

  hazardTypes = [];
  nDformID:number= 0;
  Dforms1to2Form: any;
  selectedunionsNames: [string];
  selectedpourashavasNames: [string];
  TotalUnions:number=0;
  UpazilaID:number = 0;
  UpazilaName:string='';
  Tempunions = [];
  TempseverlyAffectedunions = [];
  Temppourashavas = [];
  TempseverlyAffectedpourashavas = [];


  
  constructor( private _router: Router, private snak:MatSnackBar, private dFormService$ :DformService,   private comService$: CommonService,private http: HttpClient,    private auth: AuthService, private fb: FormBuilder) 
  {
    debugger
   this.UpazilaID = 951320;//initiaal set 
   this.nDformID = this._router.getCurrentNavigation().extras.state==undefined?0:this._router.getCurrentNavigation().extras.state.dFormID;
   if(this.nDformID!=0 ) 
    {
      debugger;
     this.GetDFrom(this.nDformID);
    }
    this.GetHazardTypes();
    this.GetUpazila(this.UpazilaID);//951320 //shahrasti
    this.GetUnions(this.UpazilaID);
    this.GetPuroshovas(this.UpazilaID);
  }

  ngOnInit() {
    
  }


GetDFrom(id:number){
  this.dFormService$.GetDForm(id).subscribe(o=>{
    var oDForm = o as any[0]; //for single Object
    this.UpazilaID = oDForm.UpazilaID;
    this.FormReset(oDForm);

  })
}
  FormReset(data:any)
  {
    debugger;
      this.Dforms1to2Form = this.fb.group({
      ID : new FormControl(data==null?0:data.ID), 
      UpazilaID: new FormControl(data==null?this.UpazilaID:data.UpazilaID),
      UpazilaName: new FormControl (data==null?this.UpazilaName:data.UpazilaName),
      Affected_Unions_ID :new FormControl(data==null?'':data.Affected_Unions_ID),
      Severly_Affected_Unions_ID:new FormControl(data==null?'':data.Severly_Affected_Unions_ID),
      Affected_Pourashavas_ID :new FormControl(data==null?'':data.Affected_Pourashavas_ID),
      Severly_Affected_Pourashavas_ID:new FormControl(data==null?'':data.Severly_Affected_Pourashavas_ID),
      HazardTypeID :new FormControl(data==null?0:data.HazardTypeID),
      TotalUnions: new FormControl (this.TotalUnions),
      IssueDate:new FormControl (data==null?new Date():data.IssueDate),// set today date,
      CreateBy:new FormControl(data==null?'':data.CreateBy),
      UnionIDs:new FormControl(''),
      unions: this.fb.array([]),
      severlyAffectedunions:this.fb.array([]),//this.buildseverlyUnions(),
      pourashavas:this.fb.array([]), //this.buildPourashavas(),
      severlyAffectedpourashavas:this.fb.array([]),//this.buildseverlyPourashavas()
      
    });
  }

  onCheckboxUnionChange(e) {
    debugger;
    const checkArray: FormArray = this.Dforms1to2Form.get('unions') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onCheckboxseverlyAffectedUnionChange(e) {
    debugger;
    const checkArray: FormArray = this.Dforms1to2Form.get('severlyAffectedunions') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onCheckboxPourashavaChange(e) {
    debugger;
    const checkArray: FormArray = this.Dforms1to2Form.get('pourashavas') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }
  onCheckboxseverlyAffectedPourashavaChange(e) {
    debugger;
    const checkArray: FormArray = this.Dforms1to2Form.get('severlyAffectedpourashavas') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  SetHazardType(id:number)
  {
    //debugger;
    this.Dforms1to2Form.HazardTypeID = id;
  }
  Setdate(type: string, event: MatDatepickerInputEvent<Date>) {
    debugger;
    //this.events.push(`${type}: ${event.value}`);
    console.log(event.value);
    this.Dforms1to2Form.IssueDate =new Date(event.value);
  }

 

  submit(value)
   {
     debugger;
  //console.log(value);
     const formValue:any = value;
var oDForm = {
  ID :0,
  UpazilaID:this.UpazilaID,
  Affected_Unions_ID :'',
  Severly_Affected_Unions_ID:'',
  Affected_Pourashavas_ID :'',
  Severly_Affected_Pourashavas_ID:'',
  HazardTypeID :parseInt(formValue.HazardTypeID),
  IssueDate:formValue.IssueDate,
  CreateBy:'',
  UnionIDs:'',

};


oDForm.Affected_Unions_ID =this.PropertyConcatation(formValue.unions);
oDForm.Severly_Affected_Unions_ID=this.PropertyConcatation(formValue.severlyAffectedunions);
oDForm.Affected_Pourashavas_ID = this.PropertyConcatation(formValue.pourashavas);
oDForm.Severly_Affected_Pourashavas_ID=this.PropertyConcatation(formValue.severlyAffectedpourashavas);
    debugger;
  oDForm.UnionIDs = this.GetDistinctIDs(oDForm);

    //console.log(formValue);
    this.http.post("Dform/SaveDForm", oDForm, { observe: 'response' }).subscribe(r=> {
      debugger    
          let oReturnObj = r as any;
          //console.log(obj);
          let obj  = oReturnObj.body;
          if(obj.msg==1){
            sessionStorage.setItem('DFormID',obj.DFormID);
            this._router.navigate(['/admin/dForms/dForms3']);
            this.snak.open("Saved Successfully!", "OK", { duration: 3000});
          }
          else if(obj.msg==2){
            this.snak.open("This data is already Exist!", "OK", { duration: 3000});
          }
          else if(obj.msg==3){
            sessionStorage.setItem('DFormID',obj.DFormID);
            this._router.navigate(['/admin/dForms/dForms3']);    
            this.snak.open("Updated Successfully!", "OK", { duration: 3000});    
          }
    
        })

  }
    //#region Concatfields
    PropertyConcatation(oList) {
      var sIDs = "";
      if (oList.length > 0) {
          for (var i = 0; i < oList.length; i++) {
              sIDs += oList[i]+ ",";
          }
          return sIDs.substring(0, sIDs.length - 1);
      }
      return sIDs;
  }

  GetDistinctIDs(formValue:any)
  {
    debugger;
    var sReturnIDs = '';
    var sIDs = [];
    //union
    var sTempObjects = formValue.Affected_Unions_ID.split(',');
    if(formValue.Affected_Unions_ID!="" && sTempObjects.length>0){this.LoadObjects(sTempObjects, sIDs);}
    //seve union
    sTempObjects = formValue.Severly_Affected_Unions_ID.split(',');
    if(formValue.Severly_Affected_Unions_ID!="" && sTempObjects.length>0){this.LoadObjects(sTempObjects, sIDs);}
//puroshova
    sTempObjects = formValue.Affected_Pourashavas_ID.split(',');
    if(formValue.Affected_Pourashavas_ID!="" && sTempObjects.length>0){this.LoadObjects(sTempObjects, sIDs);}
    //severl puroshova
    sTempObjects = formValue.Severly_Affected_Pourashavas_ID.split(',');
    if(formValue.Affected_Pourashavas_ID!="" && sTempObjects.length>0){this.LoadObjects(sTempObjects, sIDs);}

    for(var i = 0;i<sIDs.length;i++)
    {
      sReturnIDs +=sIDs[i]+',';
    }
    sReturnIDs = sReturnIDs.substr(0,sReturnIDs.length-1);
    return sReturnIDs;
  }

LoadObjects(sTempObjects:any, sMainArray:any)
{
  debugger;
  for(var i=0;i<sTempObjects.length;i++)
  {
    if(sMainArray.indexOf(sTempObjects[i]) !== -1)
    {
      //alert("Value exists!")
    } else{
  // alert("Value does not exists!")
    sMainArray.push(sTempObjects[i]);
    }
    
  }
}

  GetUpazila(id:number){
    this.comService$.GetUpazila(id).subscribe(o=>{
      var oUpazila = o as any;
      this.UpazilaID = oUpazila.UpazilaID;
      this.UpazilaName = oUpazila.UpazilaName;
      (document.getElementById('txtUpazilaName') as HTMLInputElement).value = oUpazila.UpazilaName;
     // console.log(this.list);
    })
  }

  GetUnions(id:number){
    this.comService$.GetUnionsByUpazilaId(id).subscribe(o=>{
      debugger;
      var data =o as any;
      this.Dforms1to2Form.patchValue({TotalUnions: data.length});
      data.forEach(function (element) {
        element.checked = false       
      });
      this.Tempunions = data;
      this.TempseverlyAffectedunions = data;

      this.Tempunions.forEach(function (element) {
        if(this.IsExists(element.UnionID, this.Dforms1to2Form.value.Affected_Unions_ID))
         {
          element.checked = true;///for edi use this field true or false
        }
      });

      this.TempseverlyAffectedunions.forEach(function (element) {
        if(this.IsExists(element.UnionID, this.Dforms1to2Form.value.Severly_Affected_Unions_ID))
         {
          element.checked = true;///for edi use this field true or false
        }
      });
      //this.TotalUnions = data.length;
    
     // (document.getElementById('txtTotalUnions') as HTMLInputElement).value = data.length;
     // console.log(this.list);
    })
  }

  IsExists(UnionID:number,sconcatStr:string)
  {
    var sArray = sconcatStr.split(",");
    for(var i=0;i<sconcatStr.length;i++)
    {
      if(parseInt(sconcatStr[i])== UnionID) 
      {
        return true;
      }
    }
    return false;
  }

  GetPuroshovas(id:number){
    this.comService$.GetPuroshovasByUpazilaId(id).subscribe(o=>{
      var data =o as any;
      data.forEach(function (element) {
        element.checked = false;
      });
      this.Temppourashavas =data;
      this.TempseverlyAffectedpourashavas=data;
      //this.FormReset();

    })
  }


  GetHazardTypes(){
    this.comService$.GetHazardTypes().subscribe(o=>{
      this.hazardTypes = o as any;
     // console.log(this.list);
    })
  }






}






